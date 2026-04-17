import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { read, utils } from 'xlsx'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import { calculateSalaries } from '@/lib/salary-calculator'
import { getPangkatByGolongan } from '@/lib/gaji-pokok-pp5'

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

        // Get pangkat and calculate salaries using PP 5 Tahun 2024
        const golongan = String(row['Golongan'])
        const pangkat = row['Pangkat'] ? String(row['Pangkat']) : getPangkatByGolongan(golongan) || ''

        // Calculate salaries using the proper functions
        const salaryCalculation = calculateSalaries(pangkat, golongan, masaKerja, 0)
        const { gajiPokok, pph, potonganJkn, salurNetto } = salaryCalculation
        const salurBruto = gajiPokok

        // Create user for authentication
        const username = String(row['NIP'])
        const password = await bcrypt.hash(username, 10)

        const newUser = await db.user.create({
          data: {
            username,
            password,
            role: 'GURU',
          }
        })

        // Create guru record
        await db.guru.create({
          data: {
            nik: row['NIK'] ? String(row['NIK']) : '',
            nuptk: row['NUPTK'] ? String(row['NUPTK']) : '',
            nip: String(row['NIP']),
            nama: String(row['Nama']),
            pangkat,
            golongan,
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
            user: {
              connect: {
                id: newUser.id
              }
            }
          }
        })

        successCount++
      } catch (error) {
        errors.push(`Baris ${rowNum}: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
