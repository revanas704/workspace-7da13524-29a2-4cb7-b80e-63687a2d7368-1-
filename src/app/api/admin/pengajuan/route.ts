import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get pengajuan that are NOT yet DISETUJUI or DITOLAK (still in verification)
    const pengajuan = await db.pengajuan.findMany({
      where: {
        status: {
          notIn: ['DISETUJUI', 'DITOLAK']
        }
      },
      include: {
        guru: true,
      },
      orderBy: { tanggalDiajukan: 'desc' },
    })

    return NextResponse.json(pengajuan)
  } catch (error) {
    console.error('Error fetching pengajuan:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, catatan } = body

    if (!['DISETUJUI', 'DITOLAK', 'BELUM_TERBACA_SIMTUN'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get the pengajuan first
    const pengajuan = await db.pengajuan.findUnique({
      where: { id },
      include: { guru: true },
    })

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan not found" }, { status: 404 })
    }

    // Update pengajuan status
    const updatedPengajuan = await db.pengajuan.update({
      where: { id },
      data: {
        status,
        catatan,
        tanggalVerifikasi: new Date(),
      },
    })

    // If approved, update guru data
    if (status === 'DISETUJUI') {
      const dataBaru = JSON.parse(pengajuan.dataBaru)

      // Get guru for current data reference
      const guru = await db.guru.findUnique({
        where: { id: pengajuan.guruId },
      })

      if (guru) {
        // For REKENING, only update account fields (do NOT recalculate salary)
        if (pengajuan.jenisPengajuan === 'REKENING') {
          await db.guru.update({
            where: { id: pengajuan.guruId },
            data: {
              ...(dataBaru.namaPemilikRekening && { namaPemilikRekening: dataBaru.namaPemilikRekening }),
              ...(dataBaru.nomorRekening && { nomorRekening: dataBaru.nomorRekening }),
              ...(dataBaru.bank && { bank: dataBaru.bank }),
            },
          })
        }
        // For GAJI_POKOK, recalculate and update salary
        else if (pengajuan.jenisPengajuan === 'GAJI_POKOK') {
          const { getGajiPokok, calculatePph, calculatePotonganJkn } = await import('@/lib/salary-calculator')

          // Use new data if provided, otherwise keep old data
          const newGolongan = dataBaru.golongan || guru.golongan
          const newMasaKerja = dataBaru.masaKerja !== undefined ? parseInt(dataBaru.masaKerja) : guru.masaKerja
          const newPangkat = dataBaru.pangkat || guru.pangkat

          // Calculate new gaji pokok based on PP 5 Tahun 2024
          let newGajiPokok: number
          if (dataBaru.gajiPokok) {
            // If calculated gajiPokok is provided, use it directly
            newGajiPokok = dataBaru.gajiPokok
          } else {
            // Otherwise calculate based on golongan and masaKerja
            newGajiPokok = getGajiPokok(newGolongan, newMasaKerja)
          }

          // Calculate PPH and potongan
          const pph = calculatePph(newGolongan)
          const potonganJkn = calculatePotonganJkn(newGajiPokok)

          // Salur Bruto equals Gaji Pokok
          const newSalurBrutoFinal = newGajiPokok
          const newSalurNetto = newSalurBrutoFinal - (newGajiPokok * pph) - potonganJkn

          await db.guru.update({
            where: { id: pengajuan.guruId },
            data: {
              ...(dataBaru.pangkat && { pangkat: dataBaru.pangkat }),
              ...(dataBaru.golongan && { golongan: dataBaru.golongan }),
              ...(dataBaru.masaKerja !== undefined && { masaKerja: parseInt(dataBaru.masaKerja) }),
              gajiPokok: newGajiPokok,
              salurBruto: newSalurBrutoFinal,
              pph: newGajiPokok * pph,
              potonganJkn,
              salurNetto: newSalurNetto,
            },
          })
        }
      }
    }

    return NextResponse.json(updatedPengajuan)
  } catch (error) {
    console.error('Error updating pengajuan:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
