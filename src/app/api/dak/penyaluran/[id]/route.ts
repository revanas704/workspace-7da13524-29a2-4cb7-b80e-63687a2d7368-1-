import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// PATCH - Update status penyaluran
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status harus diisi' },
        { status: 400 }
      )
    }

    // Validasi status
    const validStatuses = ['UPLOAD_SELESAI', 'DIKIRIM_KE_DJPK', 'DIKIRIM_KE_DITPA', 'SP2D']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      )
    }

    const penyaluran = await prisma.dAKPenyaluran.update({
      where: { id },
      data: { status },
      include: {
        detailPenerima: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: penyaluran,
    })
  } catch (error) {
    console.error('Error updating DAK penyaluran status:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate status penyaluran DAK' },
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
