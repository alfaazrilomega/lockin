import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

// GET — fetch single task with assignee, subtasks, comments
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true, email: true } },
        subtasks: {
          include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { order: 'asc' }
        },
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        },
        workspace: { include: { members: true } }
      }
    });

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const isOwner = task.workspace?.ownerId === user.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMember = task.workspace?.members.some((m: any) => m.userId === user.id);

    if (!isOwner && !isMember) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error: unknown) {
    console.error("GET task error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}

// PUT — update status & order (used by DnD)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();
    
    const body = await req.json();
    const { status: newStatus, order: newOrder } = body;

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

    // Log status change activity
    if (newStatus && newStatus !== task.status) {
      await prisma.workspaceActivity.create({
        data: {
          action: 'status_changed',
          entityType: 'TASK',
          entityId: taskId,
          metadata: { from: task.status, to: newStatus, taskTitle: task.title },
          workspaceId: task.workspaceId,
          actorId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error: unknown) {
    console.error("Update task status/order API error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}

// PATCH — update any task fields (description, priority, deadline, assignee, proof, etc.)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();
    const body = await req.json();

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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Build update payload — only allow safe fields
    const allowedFields = ['title', 'description', 'priority', 'deadline', 'assigneeId', 'storyPoints', 'timeSpent', 'proofUrl', 'proofNotes', 'feedback', 'status', 'order'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in body) {
        // Convert deadline string to Date
        updateData[field] = (field === 'deadline' && body[field]) ? new Date(body[field]) : body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: { assignee: { select: { id: true, name: true, avatarUrl: true } } }
    });

    // Log auditable field changes
    const auditableFields: Record<string, string> = {
      priority: 'priority_changed',
      status: 'status_changed',
      assigneeId: 'assignee_changed',
      deadline: 'deadline_changed',
    };

    const activityPromises = Object.entries(auditableFields)
      .filter(([field]) => field in updateData && updateData[field] !== (task as Record<string, unknown>)[field])
      .map(([field, action]) =>
        prisma.workspaceActivity.create({
          data: {
            action,
            entityType: 'TASK',
            entityId: taskId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: JSON.parse(JSON.stringify({
              taskTitle: task.title,
              from: (task as Record<string, unknown>)[field],
              to: updateData[field],
            })),
            workspaceId: task.workspaceId,
            actorId: user.id,
          },
        })
      );

    await Promise.all(activityPromises);

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error: unknown) {
    console.error("PATCH task error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}

// DELETE — delete a task
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();

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
      return NextResponse.json({ success: false, error: "Unauthorized: Insufficient permissions to delete this task." }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true, data: { deletedId: taskId } });
  } catch (error: unknown) {
    console.error("DELETE task error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}


