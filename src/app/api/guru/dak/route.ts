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
        dakPenyaluran: {
          createdAt: 'desc',
        },
      },
    })

    console.log('Found DAK details:', dakDetails.length)

    // Group by penyaluran to avoid duplicates
    const penyaluranMap = new Map<string, any>()

    dakDetails.forEach((detail) => {
      const penyaluranId = detail.dakPenyaluran.id
      if (!penyaluranMap.has(penyaluranId)) {
        penyaluranMap.set(penyaluranId, {
          ...detail.dakPenyaluran,
          detailPenerima: [], // We'll fill this with details matching this penyaluran
        })
      }
      // Add detail to penyaluran
      const penyaluran = penyaluranMap.get(penyaluranId)
      if (penyaluran) {
        penyaluran.detailPenerima.push({
          ...detail,
          dakPenyaluran: undefined, // Remove circular reference
        })
      }
    })

    const penyaluranList = Array.from(penyaluranMap.values())

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
