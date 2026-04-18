import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// PATCH - Update status penyaluran
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('=== PATCH /api/dak/penyaluran/[id] received ===')
  console.log('Full request URL:', request.url)
  console.log('Request method:', request.method)
  try {
    const id = params.id
    const body = await request.json()
    const { status } = body

    console.log('Update request received:', {
      id,
      status,
      idType: typeof id,
      statusType: typeof status
    })

    if (!status) {
      console.error('Status tidak diisi')
      return NextResponse.json(
        { error: 'Status harus diisi' },
        { status: 400 }
      )
    }

    // Validasi status
    const validStatuses = ['UPLOAD_SELESAI', 'DIKIRIM_KE_DJPK', 'DIKIRIM_KE_DITPA', 'SP2D']
    if (!validStatuses.includes(status)) {
      console.error('Status tidak valid:', status)
      console.error('Valid statuses:', validStatuses)
      return NextResponse.json(
        { error: 'Status tidak valid', validStatuses },
        { status: 400 }
      )
    }

    console.log('Attempting to find penyaluran with id:', id)
    const existingPenyaluran = await prisma.dAKPenyaluran.findUnique({
      where: { id }
    })

    if (!existingPenyaluran) {
      console.error('Penyaluran tidak ditemukan dengan id:', id)
      return NextResponse.json(
        { error: 'Penyaluran tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('Found penyaluran:', {
      id: existingPenyaluran.id,
      currentStatus: existingPenyaluran.status,
      jenis: existingPenyaluran.jenis
    })

    console.log('Attempting to update penyaluran...')
    const penyaluran = await prisma.dAKPenyaluran.update({
      where: { id },
      data: { status },
      include: {
        detailPenerima: true,
      },
    })

    console.log('Successfully updated penyaluran:', {
      id: penyaluran.id,
      newStatus: penyaluran.status,
      jenis: penyaluran.jenis
    })

    return NextResponse.json({
      success: true,
      data: penyaluran,
    })
  } catch (error) {
    console.error('=== Error updating DAK penyaluran status ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
    }
    return NextResponse.json(
      { error: 'Gagal mengupdate status penyaluran DAK', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus penyaluran
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Prisma akan otomatis menghapus detailPenerima karena relation dengan onDelete: Cascade
    const penyaluran = await prisma.dAKPenyaluran.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Data penyaluran berhasil dihapus',
      data: penyaluran,
    })
  } catch (error) {
    console.error('Error deleting DAK penyaluran:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus data penyaluran DAK' },
      { status: 500 }
    )
  }
}
