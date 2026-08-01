import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { LogAction } from '@prisma/client';

// GET all comments for a task
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    await requireUser();

    const comments = await prisma.taskComment.findMany({
      where: { taskId },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (err) {
    console.error('GET task comments error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST a new comment on a task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const user = await requireUser();
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Comment cannot be empty' }, { status: 400 });
    }

    // Verify the task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, workspaceId: true, title: true },
    });

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const comment = await prisma.taskComment.create({
      data: {
        content: content.trim(),
        taskId,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Log activity
    await prisma.workspaceActivity.create({
      data: {
        action: LogAction.COMMENTED,
        entityType: 'TASK',
        entityId: taskId,
        metadata: { taskTitle: task.title, preview: content.slice(0, 80) },
        workspaceId: task.workspaceId,
        actorId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (err) {
    console.error('POST task comment error:', err);
    return NextResponse.json({ success: false, error: 'Failed to add comment' }, { status: 500 });
  }
}
