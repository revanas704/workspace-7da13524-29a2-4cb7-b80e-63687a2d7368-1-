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

    const body = await request.json()
    const { jenisPengajuan, dataBaru, dokumenPendukung } = body

    if (!jenisPengajuan || !dataBaru) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
