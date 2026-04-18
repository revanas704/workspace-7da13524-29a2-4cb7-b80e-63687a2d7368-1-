import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// PATCH - Update status penyaluran
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('=== PATCH /api/dak/penyaluran/[id] received ===')
  try {
    const id = params.id
    const body = await request.json()
    const { status } = body

    console.log('Update request:', { id, status })

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
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      )
    }

    console.log('Attempting to update penyaluran...')
    const penyaluran = await prisma.dAKPenyaluran.update({
      where: { id },
      data: { status },
      include: {
        detailPenerima: true,
      },
    })

    console.log('Successfully updated penyaluran:', penyaluran.id)

    return NextResponse.json({
      success: true,
      data: penyaluran,
    })
  } catch (error) {
    console.error('Error updating DAK penyaluran status:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
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
