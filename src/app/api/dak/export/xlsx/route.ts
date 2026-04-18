import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID penyaluran tidak ditemukan' },
        { status: 400 }
      )
    }

    const penyaluran = await prisma.dAKPenyaluran.findUnique({
      where: { id },
      include: { detailPenerima: true },
    })

    if (!penyaluran) {
      return NextResponse.json(
        { error: 'Penyaluran tidak ditemukan' },
        { status: 404 }
      )
    }

    // Prepare data for Excel export
    const data = penyaluran.detailPenerima.map((item, index) => ({
      No: index + 1,
      NIP: item.nip,
      NAMA: item.nama,
      'NAMA PEMILIK REKENING': item.namaPemilikRekening,
      'NO. REKENING': item.noRekening,
      BANK: item.bank,
      SATDIK: item.satdik,
      'SALUR BRUTO': item.salurBruto,
      PPH: item.pph,
      'POT. JKN': item.potIjn,
      'SALUR NETTO': item.salurNetto,
      STATUS: item.status,
    }))

    // Create summary rows
    const summary = [
      { No: '', NIP: '', NAMA: '', 'NAMA PEMILIK REKENING': '', 'NO. REKENING': '', BANK: '', SATDIK: '', 'SALUR BRUTO': '', PPH: '', 'POT. JKN': '', 'SALUR NETTO': '', STATUS: '' },
      { No: '', NIP: '', NAMA: '', 'NAMA PEMILIK REKENING': '', 'NO. REKENING': '', BANK: '', SATDIK: '', 'SALUR BRUTO': 'TOTAL', PPH: penyaluran.potPph, 'POT. JKN': penyaluran.potJknPns + penyaluran.potJknPppk, 'SALUR NETTO': penyaluran.nilaiRekomendasi, STATUS: '' },
    ]

    // Combine data with summary
    const exportData = [...data, ...summary]

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OMSPAN-TKD')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Set headers for download
    const filename = `REKOMENDASI PENYALURAN DAK NON FISIK_${penyaluran.jenis}_${penyaluran.periode}_${penyaluran.gelombang}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting DAK to Excel:', error)
    return NextResponse.json(
      { error: 'Gagal mengekspor data ke Excel' },
      { status: 500 }
    )
  }
}
