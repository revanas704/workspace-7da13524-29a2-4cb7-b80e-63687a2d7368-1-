import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { read, utils } from 'xlsx'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    // Read Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = read(arrayBuffer)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = utils.sheet_to_json(worksheet)

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      const rowNum = i + 2 // Excel rows are 1-indexed

      try {
        // Validate required fields
        if (!row['NIP'] || !row['Nama'] || !row['Golongan']) {
          errors.push(`Baris ${rowNum}: Data tidak lengkap (NIP, Nama, dan Golongan wajib diisi)`)
          errorCount++
          continue
        }

        // Check if NIP already exists
        const existingGuru = await db.guru.findFirst({
          where: {
            nip: String(row['NIP'])
          }
        })

        if (existingGuru) {
          errors.push(`Baris ${rowNum}: NIP ${row['NIP']} sudah ada di database`)
          errorCount++
          continue
        }

        // Convert masa kerja to number
        const masaKerja = row['Masa Kerja'] ? Number(row['Masa Kerja']) : 0

        // Calculate gaji pokok (using default values, you can enhance this later)
        let gajiPokok = 2000000 // Default value
        let salurBruto = 2000000
        let pph = 0
        let potonganJkn = 0
        let salurNetto = 2000000

        // Try to calculate salary if golongan is provided
        if (row['Golongan']) {
          const golongan = String(row['Golongan'])
          
          // Calculate PPH based on golongan
          if (golongan === 'I' || golongan.startsWith('I/')) {
            pph = 0
          } else if (golongan === 'II' || golongan.startsWith('II/')) {
            pph = 0
          } else if (golongan === 'III' || golongan.startsWith('III/')) {
            pph = gajiPokok * 0.05 // 5%
          } else if (golongan === 'IV' || golongan.startsWith('IV/')) {
            pph = gajiPokok * 0.15 // 15%
          }

          // Calculate JKN deduction (1%)
          potonganJkn = gajiPokok * 0.01

          // Calculate salur netto
          salurNetto = gajiPokok - pph - potonganJkn
        }

        // Create user for authentication
        const username = String(row['NIP'])
        const password = await bcrypt.hash(username, 10)

        await db.user.create({
          data: {
            username,
            password,
            role: 'GURU',
          }
        })

        // Get the created user
        const newUser = await db.user.findFirst({
          where: { username }
        })

        // Create guru record
        await db.guru.create({
          data: {
            nik: row['NIK'] ? String(row['NIK']) : '',
            nuptk: row['NUPTK'] ? String(row['NUPTK']) : '',
            nip: String(row['NIP']),
            nama: String(row['Nama']),
            pangkat: row['Pangkat'] ? String(row['Pangkat']) : '',
            golongan: String(row['Golongan']),
            masaKerja,
            namaPemilikRekening: row['Nama Pemilik Rekening'] ? String(row['Nama Pemilik Rekening']) : '',
            nomorRekening: row['Nomor Rekening'] ? String(row['Nomor Rekening']) : '',
            bank: row['Bank'] ? String(row['Bank']) : 'BPD JAWA TIMUR',
            satuanPendidikan: row['Satuan Pendidikan'] ? String(row['Satuan Pendidikan']) : '',
            gajiPokok,
            salurBruto,
            pph,
            potonganJkn,
            salurNetto,
            statusSktp: row['Status SKTP'] ? String(row['Status SKTP']).toUpperCase() : 'BELUM',
            userId: newUser?.id,
          }
        })

        successCount++
      } catch (error) {
        errors.push(`Baris ${rowNum}: ${error}`)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      count: successCount,
      total: jsonData.length,
      errors,
      errorCount
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Gagal mengimpor data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
