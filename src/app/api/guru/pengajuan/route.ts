import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'GURU') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Handle FormData for file upload
    const formData = await request.formData()
    const jenisPengajuan = formData.get('jenisPengajuan') as string
    const dataBaruStr = formData.get('dataBaru') as string
    const dokumen = formData.get('dokumen') as File | null

    if (!jenisPengajuan || !dataBaruStr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let dataBaru: any
    try {
      dataBaru = JSON.parse(dataBaruStr)
    } catch (error) {
      return NextResponse.json({ error: "Invalid dataBaru format" }, { status: 400 })
    }

    // Validate based on jenisPengajuan
    if (jenisPengajuan === 'GAJI_POKOK') {
      if (!dataBaru.golongan || dataBaru.masaKerja === undefined || dataBaru.masaKerja === null) {
        return NextResponse.json({ error: "Golongan dan Masa Kerja wajib diisi" }, { status: 400 })
      }
      if (!dokumen) {
        return NextResponse.json({ error: "Dokumen SK Berkala/SK Pangkat wajib diupload" }, { status: 400 })
      }
    }

    if (jenisPengajuan === 'REKENING') {
      if (!dataBaru.namaPemilikRekening || !dataBaru.nomorRekening || !dataBaru.bank) {
        return NextResponse.json({ error: "Semua data rekening wajib diisi" }, { status: 400 })
      }
    }

    // Get current guru data
    const guru = await db.guru.findUnique({
      where: { id: session.user.guruId },
    })

    if (!guru) {
      return NextResponse.json({ error: "Guru not found" }, { status: 404 })
    }

    // Prepare data lama based on jenis pengajuan
    let dataLama: any = {}
    switch (jenisPengajuan) {
      case 'GAJI_POKOK':
        dataLama = {
          pangkat: guru.pangkat,
          golongan: guru.golongan,
          masaKerja: guru.masaKerja,
          gajiPokok: guru.gajiPokok,
        }
        break
      case 'PANGKAT':
        dataLama = {
          pangkat: guru.pangkat,
          golongan: guru.golongan,
        }
        break
      case 'MASA_KERJA':
        dataLama = {
          masaKerja: guru.masaKerja,
        }
        break
      case 'REKENING':
        dataLama = {
          namaPemilikRekening: guru.namaPemilikRekening,
          nomorRekening: guru.nomorRekening,
          bank: guru.bank,
        }
        break
      default:
        return NextResponse.json({ error: "Invalid jenis pengajuan" }, { status: 400 })
    }

    // Convert file to base64 if present
    let dokumenPendukung: string | undefined
    if (dokumen) {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (dokumen.size > maxSize) {
        return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(dokumen.type)) {
        return NextResponse.json({ error: "Format file harus PDF, JPG, atau PNG" }, { status: 400 })
      }

      // Convert to base64
      const bytes = await dokumen.arrayBuffer()
      const buffer = Buffer.from(bytes)
      dokumenPendukung = `data:${dokumen.type};base64,${buffer.toString('base64')}`
    }

    // Create pengajuan
    const pengajuan = await db.pengajuan.create({
      data: {
        guruId: guru.id,
        jenisPengajuan,
        dataLama: JSON.stringify(dataLama),
        dataBaru: JSON.stringify(dataBaru),
        dokumenPendukung,
        status: 'PENDING',
      },
    })

    return NextResponse.json(pengajuan)
  } catch (error) {
    console.error('Error creating pengajuan:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
