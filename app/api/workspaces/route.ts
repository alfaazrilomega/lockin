import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import type { PrismaWorkspaceResult } from '@/lib/types';

function toWorkspaceDTO(workspace: PrismaWorkspaceResult) {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    description: workspace.description,
    ownerId: workspace.ownerId,
    owner: workspace.owner,
    members: workspace.members,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}

// GET /api/workspaces — list all workspaces the current user owns or belongs to
export async function GET() {
  try {
    const authUser = await requireUser();

    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: authUser.id },
          { members: { some: { userId: authUser.id } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true }, orderBy: { joinedAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: workspaces.map((w: any) => toWorkspaceDTO(w as unknown as PrismaWorkspaceResult)),
    });
  } catch (error) {
    console.error('GET /workspaces error:', error);
    if (error instanceof Error && (error.message.includes('NEXT_REDIRECT') || error.message.startsWith('Unauthorized'))) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch workspaces', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
