import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode')
    const gelombang = searchParams.get('gelombang')

    const data = await db.dAKPenyaluran.findMany({
      where: {
        ...(periode && periode !== 'ALL' && { periode }),
        ...(gelombang && gelombang !== 'ALL' && { gelombang: parseInt(gelombang) })
      },
      orderBy: [
        { periode: 'asc' },
        { gelombang: 'asc' }
      ]
    })

    // Transform data for Excel export
    const exportData = data.map(item => ({
      'JENIS': item.jenis,
      'KANWIL': item.kanwil,
      'KPPN': item.kppn,
      'PEMDA': item.pemda,
      'PERIODE': item.periode,
      'GELOMBANG': item.gelombang,
      'SALUR BRUTO': item.salurBruto,
      'POT. PPH': item.potPph,
      'POT. JKN PNS': item.potJknPns,
      'POT. JKN PPPK': item.potJknPppk,
      'POT. JKN TOTAL': item.potJknPns + item.potJknPppk,
      'NILAI REKOMENDASI': item.nilaiRekomendasi,
      'JUMLAH PENERIMA': item.jumlahPenerima,
      'STATUS': item.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DAK Penyaluran')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    const filename = `dak-penyaluran-${periode === 'ALL' ? 'semua' : periode}-${new Date().toISOString().split('T')[0]}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Export XLSX error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
