import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { updatePersonalTaskSchema } from "@/lib/validations";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await requireUser();
    const { id: taskId } = await params;
    const body = await req.json();
    
    // Explicit Zod validation
    const validation = updatePersonalTaskSchema.parse(body);

    // Verify ownership
    const existingTask = await prisma.personalTask.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    if (existingTask.userId !== authUser.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Determine completion timestamp if status changes to DONE
    let completedAt = existingTask.completedAt;
    if (validation.status === 'DONE' && existingTask.status !== 'DONE') {
      completedAt = new Date();
    } else if (validation.status && validation.status !== 'DONE') {
      completedAt = null; // Un-complete
    }

    const updatedTask = await prisma.personalTask.update({
      where: { id: taskId },
      data: {
        title: validation.title,
        description: validation.description,
        status: validation.status,
        priority: validation.priority,
        tags: validation.tags,
        dueDate: validation.dueDate,
        isRecurring: validation.isRecurring,
        recurPattern: validation.recurPattern,
        completedAt,
        // Optional drag-and-drop support
        ...(body.order !== undefined ? { order: body.order } : {})
      },
    });

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update personal task error:", error);
    return NextResponse.json({ success: false, error: "Failed to update personal task" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await requireUser();
    const { id: taskId } = await params;

    // Verify ownership
    const existingTask = await prisma.personalTask.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    if (existingTask.userId !== authUser.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await prisma.personalTask.delete({
      where: { id: taskId }
    });

    return NextResponse.json({ success: true, data: { deletedId: taskId } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete personal task error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete personal task" }, { status: 500 });
  }
}
