import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';

// GET unified activity feed: merges WorkspaceActivity logs + TaskComments for a task
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    await requireUser();

    const [activities, comments] = await Promise.all([
      prisma.workspaceActivity.findMany({
        where: { entityType: 'TASK', entityId: taskId },
        include: {
          actor: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.taskComment.findMany({
        where: { taskId },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Normalise into a single stream
    const feed = [
      ...activities.map((a) => ({
        id: a.id,
        type: 'activity' as const,
        action: a.action,
        metadata: a.metadata,
        actor: a.actor,
        createdAt: a.createdAt,
      })),
      ...comments.map((c) => ({
        id: c.id,
        type: 'comment' as const,
        content: c.content,
        actor: c.author,
        editedAt: c.editedAt,
        createdAt: c.createdAt,
      })),
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json({ success: true, data: feed });
  } catch (err) {
    console.error('GET task activity error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}
