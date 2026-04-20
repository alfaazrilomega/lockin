import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireUser()
    const { id } = await params
    const body = await req.json()
    const { isRead } = body

    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification || notification.userId !== authUser.id) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    console.error("PATCH /api/notifications/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update notification" }, { status: 500 })
  }
}
