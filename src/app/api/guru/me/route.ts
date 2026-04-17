import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'GURU') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const guru = await db.guru.findUnique({
      where: { id: session.user.guruId },
      include: {
        pengajuanList: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!guru) {
      return NextResponse.json({ error: "Guru not found" }, { status: 404 })
    }

    return NextResponse.json(guru)
  } catch (error) {
    console.error('Error fetching guru data:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
