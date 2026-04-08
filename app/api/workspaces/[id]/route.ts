import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeWorkspaceAccess, getWorkspaceRole } from '@/lib/auth-helpers';
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

// GET /api/workspaces/:id — get workspace detail + current user's role
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    const authUser = await requireUser();
    await authorizeWorkspaceAccess(workspaceId, authUser.id);

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        owner: true,
        members: { include: { user: true }, orderBy: { joinedAt: 'asc' } },
      },
    });

    if (!workspace) {
      return NextResponse.json({ success: false, error: 'Workspace not found' }, { status: 404 });
    }

    const currentUserRole = await getWorkspaceRole(workspaceId, authUser.id);

    return NextResponse.json({
      success: true,
      data: {
        ...toWorkspaceDTO(workspace as unknown as PrismaWorkspaceResult),
        currentUserRole: currentUserRole ?? 'MEMBER',
      },
    });
  } catch (error) {
    console.error('GET /workspaces/:id error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch workspace' }, { status: 500 });
  }
}
