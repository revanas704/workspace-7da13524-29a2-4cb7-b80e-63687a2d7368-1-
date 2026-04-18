import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    // Create template data structure
    const templateData = [
      {
        'NIP': '196901011995031001',
        'NAMA': 'CONTOH NAMA GURU',
        'NAMA PEMILIK REKENING': 'CONTOH NAMA GURU',
        'NO. REKENING': '1234567890',
        'BANK': 'BRI',
        'SATDIK': 'SD NEGERI 1 BLITAR',
        'SALUR BRUTO': 2500000,
        'PPH': 125000,
        'POT. JKN': 25000,
        'SALUR NETTO': 2350000,
        'STATUS': 'TERKIRIM'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template-dak-non-fisik.xlsx"'
      }
    })
  } catch (error) {
    console.error('Template download error:', error)
    return NextResponse.json(
      { error: 'Failed to download template' },
      { status: 500 }
    )
  }
}
