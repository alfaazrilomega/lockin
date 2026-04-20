import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function POST() {
  try {
    const authUser = await requireUser();

    // Mark all unread notifications as read
    const updateResult = await prisma.notification.updateMany({
      where: { 
        userId: authUser.id,
        isRead: false 
      },
      data: { isRead: true }
    });

    return NextResponse.json({ 
      success: true, 
      data: { updatedCount: updateResult.count }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Mark all notifications read error:", error);
    return NextResponse.json({ success: false, error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
