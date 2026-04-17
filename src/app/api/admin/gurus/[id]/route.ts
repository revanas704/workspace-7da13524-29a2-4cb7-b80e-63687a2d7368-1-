import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // Recalculate salary details based on golongan and masa kerja
    const { calculateSalaries } = await import('@/lib/salary-calculator')
    const salaryData = calculateSalaries(
      body.pangkat,
      body.golongan,
      body.masaKerja,
      0 // salurBruto parameter is not used anymore
    )

    // Salur Bruto = Gaji Pokok
    const salurBruto = salaryData.gajiPokok

    const guru = await db.guru.update({
      where: { id },
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
        salurBruto: salurBruto, // Same as gajiPokok
        pph: salaryData.pph,
        potonganJkn: salaryData.potonganJkn,
        salurNetto: salaryData.salurNetto,
        statusSktp: body.statusSktp,
      },
    })

    return NextResponse.json(guru)
  } catch (error: any) {
    console.error('Error updating guru:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "NIP sudah terdaftar" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    await db.guru.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Guru deleted successfully" })
  } catch (error) {
    console.error('Error deleting guru:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
