import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();
    
    const body = await req.json();
    const { status: newStatus, order: newOrder } = body;

    // Verify user has access to task (indirectly through workspace permissions)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: { include: { members: true } } }
    });

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const isOwner = task.workspace?.ownerId === user.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMember = task.workspace?.members.some((m: any) => 
      m.userId === user.id && ['EDITOR', 'LEADER'].includes(m.permission)
    );

    if (!isOwner && !isMember) {
      return NextResponse.json({ success: false, error: "Unauthorized: Insufficient permissions to move this task." }, { status: 403 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus, order: newOrder }
    });

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error: unknown) {
    console.error("Update task status/order API error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}
