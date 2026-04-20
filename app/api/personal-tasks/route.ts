import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { createPersonalTaskSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const authUser = await requireUser();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const whereClause: any = { userId: authUser.id };
    
    if (status) {
      // Validate status
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }

    const tasks = await prisma.personalTask.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Fetch personal tasks error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch personal tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    const body = await req.json();
    
    const validation = createPersonalTaskSchema.parse(body);

    // Determine the next order index for UI drag-and-drop
    const lastTask = await prisma.personalTask.findFirst({
      where: { userId: authUser.id, status: validation.status },
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    
    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    const task = await prisma.personalTask.create({
      data: {
        userId: authUser.id,
        title: validation.title,
        description: validation.description,
        status: validation.status,
        priority: validation.priority,
        tags: validation.tags,
        dueDate: validation.dueDate,
        isRecurring: validation.isRecurring,
        recurPattern: validation.recurPattern,
        order: newOrder,
        ...(validation.status === 'DONE' ? { completedAt: new Date() } : {})
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create personal task error:", error);
    return NextResponse.json({ success: false, error: "Failed to create personal task" }, { status: 500 });
  }
}
