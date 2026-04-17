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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'

    const pengajuan = await db.pengajuan.findMany({
      where: { status },
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

    if (!['DISETUJUI', 'DITOLAK'].includes(status)) {
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

      // Recalculate salary if needed
      const { calculateSalaries } = await import('@/lib/salary-calculator')
      const guru = await db.guru.findUnique({
        where: { id: pengajuan.guruId },
      })

      if (guru) {
        const salaryData = calculateSalaries(
          dataBaru.pangkat || guru.pangkat,
          dataBaru.golongan || guru.golongan,
          dataBaru.masaKerja !== undefined ? parseInt(dataBaru.masaKerja) : guru.masaKerja,
          dataBaru.salurBruto || guru.salurBruto
        )

        await db.guru.update({
          where: { id: pengajuan.guruId },
          data: {
            ...(dataBaru.pangkat && { pangkat: dataBaru.pangkat }),
            ...(dataBaru.golongan && { golongan: dataBaru.golongan }),
            ...(dataBaru.masaKerja !== undefined && { masaKerja: parseInt(dataBaru.masaKerja) }),
            ...(dataBaru.namaPemilikRekening && { namaPemilikRekening: dataBaru.namaPemilikRekening }),
            ...(dataBaru.nomorRekening && { nomorRekening: dataBaru.nomorRekening }),
            ...(dataBaru.bank && { bank: dataBaru.bank }),
            gajiPokok: salaryData.gajiPokok,
            pph: salaryData.pph,
            potonganJkn: salaryData.potonganJkn,
            salurNetto: salaryData.salurNetto,
          },
        })
      }
    }

    return NextResponse.json(updatedPengajuan)
  } catch (error) {
    console.error('Error updating pengajuan:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
