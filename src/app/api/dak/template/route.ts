import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    // Create template data
    const templateData = [
      {
        'NIP': '196601011987031020',
        'NAMA': 'Nama Guru',
        'NAMA PEMILIK REKENING': 'Nama Pemilik Rekening',
        'NO. REKENING': '000901007862536',
        'BANK': '',
        'SATDIK': 'UPT SD NEGERI CONTOH 01',
        'SALUR BRUTO': 5628300,
        'PPH': 844245,
        'POT. JKN': 50406,
        'SALUR NETTO': 4733649,
        'STATUS': '',
      },
      {
        'NIP': '196601011989031029',
        'NAMA': 'Nama Guru 2',
        'NAMA PEMILIK REKENING': 'Nama Pemilik Rekening 2',
        'NO. REKENING': '000901003607536',
        'BANK': '',
        'SATDIK': 'UPT SMP NEGERI 1 CONTOH',
        'SALUR BRUTO': 5866400,
        'PPH': 879960,
        'POT. JKN': 46405,
        'SALUR NETTO': 4940035,
        'STATUS': '',
      },
    ]

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OMSPAN-TKD')

    // Set column widths
    worksheet['!cols'] = [
      { wch: 18 }, // NIP
      { wch: 30 }, // NAMA
      { wch: 30 }, // NAMA PEMILIK REKENING
      { wch: 18 }, // NO. REKENING
      { wch: 10 }, // BANK
      { wch: 30 }, // SATDIK
      { wch: 15 }, // SALUR BRUTO
      { wch: 12 }, // PPH
      { wch: 12 }, // POT. JKN
      { wch: 15 }, // SALUR NETTO
      { wch: 10 }, // STATUS
    ]

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Set headers for download
    const filename = 'TEMPLATE_IMPORT_DAK_NON_FISIK.xlsx'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json(
      { error: 'Gagal mengunduh template' },
      { status: 500 }
    )
  }
}
