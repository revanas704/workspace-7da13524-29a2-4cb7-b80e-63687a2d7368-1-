import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode')
    const gelombang = searchParams.get('gelombang')
    const status = searchParams.get('status')

    const where: any = {}
    if (periode && periode !== 'ALL') {
      where.periode = periode
    }
    if (gelombang && gelombang !== 'ALL') {
      where.gelombang = gelombang
    }
    if (status && status !== 'ALL') {
      where.status = status
    }

    const data = await prisma.dAKPenyaluran.findMany({
      where,
      include: {
        detailPenerima: true,
      },
      orderBy: [
        { periode: 'desc' },
        { gelombang: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching DAK penyaluran:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data penyaluran DAK' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('=== DAK Import POST received ===')
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jenis = formData.get('jenis') as string
    const periode = formData.get('periode') as string
    const gelombang = formData.get('gelombang') as string
    const status = formData.get('status') as string

    console.log('Received data:', { jenis, periode, gelombang, status, hasFile: !!file, fileName: file?.name })

    if (!file) {
      console.error('File tidak ditemukan')
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    console.log('Reading Excel file...')
    // Read Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

    console.log(`Excel data loaded: ${jsonData.length} rows`)

    if (jsonData.length === 0) {
      console.error('File Excel kosong')
      return NextResponse.json(
        { error: 'File Excel kosong' },
        { status: 400 }
      )
    }

    console.log('First row data:', JSON.stringify(jsonData[0], null, 2))

    // Calculate totals
    let totalSalurBruto = 0
    let totalNilaiRekomendasi = 0
    let totalPotPPH = 0
    let totalPotJKN = 0

    const penerimaData = jsonData.map((row) => {
      const salurBruto = parseFloat(row['SALUR BRUTO']) || 0
      const potPPH = parseFloat(row['PPH']) || 0
      const potJKN = parseFloat(row['POT. JKN']) || 0
      const salurNetto = parseFloat(row['SALUR NETTO']) || 0

      totalSalurBruto += salurBruto
      totalPotPPH += potPPH
      totalPotJKN += potJKN

      const penerimaItem = {
        nip: row['NIP']?.toString() || '',
        nama: row['NAMA']?.toString() || '',
        namaPemilikRekening: row['NAMA PEMILIK REKENING']?.toString() || '',
        noRekening: row['NO. REKENING']?.toString() || '',
        bank: row['BANK']?.toString() || '',
        satdik: row['SATDIK']?.toString() || '',
        salurBruto,
        pph: potPPH,
        potIjn: potJKN,
        salurNetto,
        status: 'BELUM',
      }
      return penerimaItem
    })

    console.log(`Processed ${penerimaData.length} recipients`)
    console.log('Totals:', { totalSalurBruto, totalPotPPH, totalPotJKN })

    // Nilai rekomendasi = salurBruto - totalPotPPH - totalPotJKN (same as sum of salurNetto)
    totalNilaiRekomendasi = totalSalurBruto - totalPotPPH - totalPotJKN

    console.log('Creating DAK Penyaluran record...')
    // Create penyaluran record
    const penyaluran = await prisma.dAKPenyaluran.create({
      data: {
        jenis,
        periode,
        gelombang: parseInt(gelombang) || 1,
        status,
        salurBruto: totalSalurBruto,
        nilaiRekomendasi: totalNilaiRekomendasi,
        potPph: totalPotPPH,
        potJknPns: totalPotJKN,
        potJknPppk: 0,
        jumlahPenerima: penerimaData.length,
        kanwil: '',
        kppn: '',
        pemda: '',
        durasiKerja: 0,
        bankOperator: '',
        spp: '',
        sp2d: '',
        detailPenerima: {
          create: penerimaData.map((item) => ({
            nip: item.nip,
            nama: item.nama,
            namaPemilikRekening: item.namaPemilikRekening,
            noRekening: item.noRekening,
            bank: item.bank,
            satdik: item.satdik,
            salurBruto: item.salurBruto,
            pph: item.pph,
            potIjn: item.potIjn,
            salurNetto: item.salurNetto,
            status: item.status,
          })),
        },
      },
      include: {
        detailPenerima: true,
      },
    })

    console.log(`Successfully created DAK Penyaluran with ID: ${penyaluran.id}`)

    return NextResponse.json({
      success: true,
      count: penerimaData.length,
      data: penyaluran,
    })
  } catch (error) {
    console.error('Error importing DAK penyaluran:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Gagal mengimpor data penyaluran DAK', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
