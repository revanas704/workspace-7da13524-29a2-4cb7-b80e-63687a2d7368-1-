import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get detail penerima by penyaluran ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detailData = await db.dAKDetailPenerima.findMany({
      where: {
        dakPenyaluranId: params.id
      },
      orderBy: {
        nama: 'asc'
      }
    })

    return NextResponse.json(detailData)
  } catch (error) {
    console.error('Error fetching DAK detail:', error)
    return NextResponse.json(
      { error: 'Failed to fetch DAK detail data' },
      { status: 500 }
    )
  }
}
