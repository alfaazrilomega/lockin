import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeWorkspaceOwner } from '@/lib/auth-helpers';
import { updateWorkspaceMemberSchema } from '@/lib/validations';
import { z } from 'zod';
import type { WorkspaceMemberDTO, PermissionLevel } from '@/lib/types';

// ─────────────────────────────────────────────────────────
// PATCH /api/workspaces/:id/members/:memberId
// Update a member's permission level.
// Only the workspace OWNER can call this.
// ─────────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id: workspaceId, memberId } = await params;
    const authUser = await requireUser();
    await authorizeWorkspaceOwner(workspaceId, authUser.id);

    const body = await request.json();
    const validation = updateWorkspaceMemberSchema.parse(body);

    // Ensure the member record belongs to this workspace
    const existingMember = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: 'Member not found in this workspace' },
        { status: 404 }
      );
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { permission: validation.permission },
      include: { user: true },
    });

    const dto: WorkspaceMemberDTO = {
      id: updated.id,
      userId: updated.user.id,
      name: updated.user.name,
      email: updated.user.email,
      avatarUrl: updated.user.avatarUrl,
      permission: updated.permission as unknown as PermissionLevel,
      isOwner: false,
      joinedAt: updated.joinedAt,
    };

    return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    console.error('PATCH /workspaces/:id/members/:memberId error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Failed to update member' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────
// DELETE /api/workspaces/:id/members/:memberId
// Remove (kick) a member from the workspace.
// Only the workspace OWNER can call this.
// Self-leave is handled via DELETE /api/workspaces/:id/members/me
// ─────────────────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id: workspaceId, memberId } = await params;
    const authUser = await requireUser();

    // Special case: "me" means the current user wants to leave
    if (memberId === 'me') {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });
      if (!workspace) {
        return NextResponse.json({ success: false, error: 'Workspace not found' }, { status: 404 });
      }
      if (workspace.ownerId === authUser.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Owners cannot leave their workspace. Transfer ownership or delete it instead.',
          },
          { status: 400 }
        );
      }

      const memberRecord = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: authUser.id } },
      });
      if (!memberRecord) {
        return NextResponse.json(
          { success: false, error: 'You are not a member of this workspace' },
          { status: 404 }
        );
      }

      await prisma.workspaceMember.delete({ where: { id: memberRecord.id } });
      return NextResponse.json({ success: true });
    }

    // Default: owner kicking a specific member
    await authorizeWorkspaceOwner(workspaceId, authUser.id);

    const existingMember = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: 'Member not found in this workspace' },
        { status: 404 }
      );
    }

    await prisma.workspaceMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /workspaces/:id/members/:memberId error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to remove member' }, { status: 500 });
  }
}
