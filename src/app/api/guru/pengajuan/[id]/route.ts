import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cari guru berdasarkan email
    const guru = await db.guru.findUnique({
      where: { email: session.user.email }
    })

    if (!guru) {
      return NextResponse.json({ error: 'Guru tidak ditemukan' }, { status: 404 })
    }

    // Cari pengajuan yang akan dihapus
    const pengajuan = await db.pengajuan.findFirst({
      where: {
        id: params.id,
        guruId: guru.id
      }
    })

    if (!pengajuan) {
      return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 })
    }

    // Hapus pengajuan (boleh untuk semua status termasuk disetujui)
    await db.pengajuan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Pengajuan berhasil dihapus' 
    })
  } catch (error) {
    console.error('Error deleting pengajuan:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus pengajuan' },
      { status: 500 }
    )
  }
}
