import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 16
    const { id } = await params

    const session = await getServerSession(authOptions)

    console.log('DELETE - Session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      role: session?.user?.role,
      guruId: session?.user?.guruId,
      pengajuanId: id
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 })
    }

    if (session.user.role !== 'GURU') {
      return NextResponse.json({ error: 'Forbidden - Invalid role' }, { status: 403 })
    }

    if (!session.user.guruId) {
      return NextResponse.json({ error: 'Unauthorized - No guruId in session' }, { status: 401 })
    }

    // Cari pengajuan yang akan dihapus
    const pengajuan = await db.pengajuan.findFirst({
      where: {
        id: id,
        guruId: session.user.guruId
      }
    })

    if (!pengajuan) {
      return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 })
    }

    console.log('Deleting pengajuan:', {
      id: id,
      guruId: session.user.guruId,
      found: !!pengajuan
    })

    // Hapus pengajuan (boleh untuk semua status termasuk disetujui)
    await db.pengajuan.delete({
      where: { id: id }
    })

    console.log('Successfully deleted pengajuan:', id)

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
