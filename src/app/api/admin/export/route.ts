import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as XLSX from 'xlsx'

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
      orderBy: { nama: 'asc' },
    })

    // Format data for Excel export
    const exportData = gurus.map((guru: any, index: number) => ({
      'No': index + 1,
      'NIK': guru.nik,
      'NUPTK': guru.nuptk,
      'NIP': guru.nip,
      'Nama': guru.nama,
      'Pangkat': guru.pangkat,
      'Golongan': guru.golongan,
      'Masa Kerja': guru.masaKerja + ' Tahun',
      'Satuan Pendidikan': guru.satuanPendidikan,
      'Gaji Pokok': new Intl.NumberFormat('id-ID').format(guru.gajiPokok),
      'Salur Bruto': new Intl.NumberFormat('id-ID').format(guru.salurBruto),
      'PPH': new Intl.NumberFormat('id-ID').format(guru.pph),
      'Potongan JKN': new Intl.NumberFormat('id-ID').format(guru.potonganJkn),
      'Salur Netto': new Intl.NumberFormat('id-ID').format(guru.salurNetto),
      'Status SKTP': guru.statusSktp,
      'Nama Rekening': guru.namaPemilikRekening,
      'No. Rekening': guru.nomorRekening,
      'Bank': guru.bank,
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Guru')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as file download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="data-guru-tunjangan-profesi.xlsx"',
      },
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
