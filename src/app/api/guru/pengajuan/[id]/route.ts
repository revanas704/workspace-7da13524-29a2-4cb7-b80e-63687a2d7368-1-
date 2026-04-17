import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'GURU') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pengajuanId = params.id

    // Get the pengajuan to check ownership
    const pengajuan = await db.pengajuan.findUnique({
      where: { id: pengajuanId },
    })

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan not found" }, { status: 404 })
    }

    // Check if the pengajuan belongs to the logged-in guru
    if (pengajuan.guruId !== session.user.guruId) {
      return NextResponse.json({ error: "Forbidden - You can only delete your own pengajuan" }, { status: 403 })
    }

    // Only allow deletion of PENDING pengajuan
    if (pengajuan.status !== 'PENDING') {
      return NextResponse.json({ error: "Can only delete pending pengajuan" }, { status: 400 })
    }

    // Delete the pengajuan
    await db.pengajuan.delete({
      where: { id: pengajuanId },
    })

    return NextResponse.json({ message: "Pengajuan berhasil dihapus" })
  } catch (error) {
    console.error('Error deleting pengajuan:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
