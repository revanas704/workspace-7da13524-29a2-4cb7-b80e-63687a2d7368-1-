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
    const satuanPendidikan = searchParams.get('satuanPendidikan')
    const golongan = searchParams.get('golongan')
    const statusSktp = searchParams.get('statusSktp')

    const where: any = {}

    if (satuanPendidikan) {
      where.satuanPendidikan = {
        contains: satuanPendidikan,
        mode: 'insensitive'
      }
    }

    if (golongan) {
      where.golongan = golongan
    }

    if (statusSktp) {
      where.statusSktp = statusSktp
    }

    const gurus = await db.guru.findMany({
      where,
      include: {
        user: true,
        pengajuanList: {
          where: { status: 'PENDING' },
        },
      },
      orderBy: { nama: 'asc' },
    })

    return NextResponse.json(gurus)
  } catch (error) {
    console.error('Error fetching gurus:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Calculate salary details
    const { calculateSalaries } = await import('@/lib/salary-calculator')
    const salaryData = calculateSalaries(
      body.pangkat,
      body.golongan,
      body.masaKerja,
      body.salurBruto || 2000000
    )

    const guru = await db.guru.create({
      data: {
        nik: body.nik,
        nuptk: body.nuptk,
        nip: body.nip,
        nama: body.nama,
        pangkat: body.pangkat,
        golongan: body.golongan,
        masaKerja: parseInt(body.masaKerja),
        namaPemilikRekening: body.namaPemilikRekening,
        nomorRekening: body.nomorRekening,
        bank: body.bank,
        satuanPendidikan: body.satuanPendidikan,
        gajiPokok: salaryData.gajiPokok,
        salurBruto: body.salurBruto || 2000000,
        pph: salaryData.pph,
        potonganJkn: salaryData.potonganJkn,
        salurNetto: salaryData.salurNetto,
        statusSktp: body.statusSktp || 'BELUM',
      },
    })

    return NextResponse.json(guru)
  } catch (error: any) {
    console.error('Error creating guru:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "NIP sudah terdaftar" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
