import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get guru data from session
    const guruId = session.user.guruId
    if (!guruId) {
      return NextResponse.json(
        { error: 'Guru ID not found in session' },
        { status: 400 }
      )
    }

    // Get guru details (including NIP)
    const guru = await prisma.guru.findUnique({
      where: { id: guruId },
    })

    if (!guru) {
      return NextResponse.json(
        { error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('Fetching DAK data for guru:', {
      guruId,
      nip: guru.nip,
      nama: guru.nama,
    })

    // Find all DAK detail entries for this guru's NIP
    const dakDetails = await prisma.dAKDetailPenerima.findMany({
      where: { nip: guru.nip },
      include: {
        dakPenyaluran: true,
      },
      orderBy: {
        nama: 'asc',
      },
    })

    console.log('Found DAK details:', dakDetails.length)

    // Group by penyaluran to avoid duplicates and maintain consistent structure with admin API
    const penyaluranMap = new Map<string, any>()

    dakDetails.forEach((detail) => {
      const penyaluranId = detail.dakPenyaluranId
      if (!penyaluranMap.has(penyaluranId)) {
        // Create penyaluran entry with all fields from dakPenyaluran
        // BUT calculate totals only for this guru, not all recipients
        penyaluranMap.set(penyaluranId, {
          id: detail.dakPenyaluran.id,
          jenis: detail.dakPenyaluran.jenis,
          kanwil: detail.dakPenyaluran.kanwil,
          kppn: detail.dakPenyaluran.kppn,
          pemda: detail.dakPenyaluran.pemda,
          periode: detail.dakPenyaluran.periode,
          gelombang: detail.dakPenyaluran.gelombang,
          salurBruto: detail.salurBruto, // Only this guru's salurBruto
          potPph: detail.pph, // Only this guru's potPph
          potJknPns: detail.potIjn, // Only this guru's potIjn
          potJknPppk: 0, // Not used at individual level
          nilaiRekomendasi: detail.salurNetto, // Only this guru's salurNetto
          jumlahPenerima: 1, // Only this guru
          kirimKeDitPa: detail.dakPenyaluran.kirimKeDitPa,
          kirimKeKppn: detail.dakPenyaluran.kirimKeKppn,
          durasiKerja: detail.dakPenyaluran.durasiKerja,
          bankOperator: detail.dakPenyaluran.bankOperator,
          spp: detail.dakPenyaluran.spp,
          sp2d: detail.dakPenyaluran.sp2d,
          status: detail.dakPenyaluran.status,
          createdAt: detail.dakPenyaluran.createdAt,
          updatedAt: detail.dakPenyaluran.updatedAt,
          detailPenerima: [], // Will be filled with only this guru's details
        })
      }
      // Add this guru's detail to penyaluran
      const penyaluran = penyaluranMap.get(penyaluranId)
      if (penyaluran) {
        penyaluran.detailPenerima.push({
          id: detail.id,
          dakPenyaluranId: detail.dakPenyaluranId,
          nip: detail.nip,
          nama: detail.nama,
          namaPemilikRekening: detail.namaPemilikRekening,
          noRekening: detail.noRekening,
          bank: detail.bank,
          satdik: detail.satdik,
          salurBruto: detail.salurBruto,
          pph: detail.pph,
          potIjn: detail.potIjn,
          salurNetto: detail.salurNetto,
          status: detail.status,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
        })
      }
    })

    // Convert to array and sort by createdAt desc to match admin API
    const penyaluranList = Array.from(penyaluranMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    console.log('Returning penyaluran list:', penyaluranList.length)

    return NextResponse.json(penyaluranList)
  } catch (error) {
    console.error('Error fetching DAK data for guru:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Gagal memuat data DAK' },
      { status: 500 }
    )
  }
}
