import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// GET - List all DAK penyaluran
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
        { periode: 'desc' },
        { gelombang: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching DAK penyaluran:', error)
    return NextResponse.json(
      { error: 'Failed to fetch DAK penyaluran data' },
      { status: 500 }
    )
  }
}

// POST - Import new DAK penyaluran data
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jenis = formData.get('jenis') as string
    const kanwil = formData.get('kanwil') as string
    const kppn = formData.get('kppn') as string
    const pemda = formData.get('pemda') as string
    const periode = formData.get('periode') as string
    const gelombang = parseInt(formData.get('gelombang') as string)
    const status = formData.get('status') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read and parse Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in Excel file' },
        { status: 400 }
      )
    }

    // Calculate totals from detail data
    let totalSalurBruto = 0
    let totalPotPph = 0
    let totalPotJkn = 0
    let totalSalurNetto = 0

    data.forEach((item: any) => {
      totalSalurBruto += parseFloat(item['SALUR BRUTO'] || item['SALUR BRUTO'] || 0)
      totalPotPph += parseFloat(item['PPH'] || item['PPH'] || 0)
      totalPotJkn += parseFloat(item['POT. JKN'] || item['POT. JKN'] || 0)
      totalSalurNetto += parseFloat(item['SALUR NETTO'] || item['SALUR NETTO'] || 0)
    })

    // Calculate nilai rekomendasi
    const nilaiRekomendasi = totalSalurBruto - totalPotPph - totalPotJkn

    // Create DAK penyaluran record
    const dakPenyaluran = await db.dAKPenyaluran.create({
      data: {
        jenis,
        kanwil,
        kppn,
        pemda,
        periode,
        gelombang,
        salurBruto: totalSalurBruto,
        potPph: totalPotPph,
        potJknPns: totalPotJkn * 0.5, // Assuming split between PNS and PPPK
        potJknPppk: totalPotJkn * 0.5,
        nilaiRekomendasi,
        jumlahPenerima: data.length,
        kirimKeDitPa: null,
        kirimKeKppn: null,
        durasiKerja: 0,
        bankOperator: '',
        spp: '',
        sp2d: '',
        status
      }
    })

    // Create detail penerima records
    const detailPenerimaData = data.map((item: any) => ({
      dakPenyaluranId: dakPenyaluran.id,
      nip: item['NIP'] || item['NIP'] || '',
      nama: item['NAMA'] || item['NAMA'] || '',
      namaPemilikRekening: item['NAMA PEMILIK REKENING'] || item['NAMA PEMILIK REKENING'] || '',
      noRekening: item['NO. REKENING'] || item['NO REKENING'] || item['NO. REKENING'] || '',
      bank: item['BANK'] || item['BANK'] || '',
      satdik: item['SATDIK'] || item['SATDIK'] || '',
      salurBruto: parseFloat(item['SALUR BRUTO'] || item['SALUR BRUTO'] || 0),
      pph: parseFloat(item['PPH'] || item['PPH'] || 0),
      potIjn: parseFloat(item['POT. JKN'] || item['POT. JKN'] || 0),
      salurNetto: parseFloat(item['SALUR NETTO'] || item['SALUR NETTO'] || 0),
      status: item['STATUS'] || item['STATUS'] || 'TERKIRIM'
    }))

    await db.dAKDetailPenerima.createMany({
      data: detailPenerimaData
    })

    return NextResponse.json({
      success: true,
      message: 'Data successfully imported',
      totalPenerima: data.length,
      data: dakPenyaluran
    })
  } catch (error) {
    console.error('Error importing DAK penyaluran:', error)
    return NextResponse.json(
      { error: 'Failed to import DAK penyaluran data' },
      { status: 500 }
    )
  }
}
