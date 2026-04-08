import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeWorkspaceOwner, authorizeWorkspaceAccess, getWorkspaceRole } from '@/lib/auth-helpers';
import { inviteWorkspaceMemberByEmailSchema, addWorkspaceMemberSchema } from '@/lib/validations';
import { z } from 'zod';
import type { WorkspaceMemberDTO, PermissionLevel } from '@/lib/types';

// ─────────────────────────────────────────────────────────
// GET /api/workspaces/:id/members
// List all members (including owner) of a workspace.
// Accessible by any member or owner.
// ─────────────────────────────────────────────────────────
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
        members: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ success: false, error: 'Workspace not found' }, { status: 404 });
    }

    // Compose unified list — owner first
    const ownerDTO: WorkspaceMemberDTO = {
      id: null,
      userId: workspace.owner.id,
      name: workspace.owner.name,
      email: workspace.owner.email,
      avatarUrl: workspace.owner.avatarUrl,
      permission: null,
      isOwner: true,
      joinedAt: null,
    };

    const memberDTOs: WorkspaceMemberDTO[] = workspace.members.map((m: {
      id: string;
      permission: string;
      joinedAt: Date;
      user: { id: string; name: string; email: string; avatarUrl: string | null };
    }) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      permission: m.permission as unknown as PermissionLevel,
      isOwner: false,
      joinedAt: m.joinedAt,
    }));

    const currentUserRole = await getWorkspaceRole(workspaceId, authUser.id);

    return NextResponse.json({
      success: true,
      data: {
        members: [ownerDTO, ...memberDTOs],
        currentUserRole: currentUserRole ?? 'MEMBER',
      },
    });
  } catch (error) {
    console.error('GET /workspaces/:id/members error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch members' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────
// POST /api/workspaces/:id/members
// Invite a member to the workspace.
// Body option A: { email, permission }   — invite by email
// Body option B: { userId, permission }  — add by userId
// Only the workspace OWNER can call this.
// ─────────────────────────────────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    const authUser = await requireUser();
    await authorizeWorkspaceOwner(workspaceId, authUser.id);

    const body = await request.json();

    // Determine invite mode: by email or by userId
    let targetUserId: string;

    if (body.email) {
      // Invite by email
      const validation = inviteWorkspaceMemberByEmailSchema.parse(body);

      const targetUser = await prisma.user.findUnique({ where: { email: validation.email } });
      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: 'No user found with that email address' },
          { status: 404 }
        );
      }
      if (targetUser.id === authUser.id) {
        return NextResponse.json(
          { success: false, error: 'You cannot invite yourself to your own workspace' },
          { status: 400 }
        );
      }
      targetUserId = targetUser.id;
      body.permission = validation.permission;
    } else if (body.userId) {
      // Add by userId
      const validation = addWorkspaceMemberSchema.parse(body);

      if (validation.userId === authUser.id) {
        return NextResponse.json(
          { success: false, error: 'You cannot add yourself as a member' },
          { status: 400 }
        );
      }
      const targetUser = await prisma.user.findUnique({ where: { id: validation.userId } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      targetUserId = validation.userId;
      body.permission = validation.permission;
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide either "email" or "userId" in the request body' },
        { status: 400 }
      );
    }

    // Check duplicate membership
    const existing = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this workspace' },
        { status: 409 }
      );
    }

    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUserId,
        permission: body.permission ?? 'EDITOR',
      },
      include: { user: true },
    });

    const dto: WorkspaceMemberDTO = {
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatarUrl: member.user.avatarUrl,
      permission: member.permission as unknown as PermissionLevel,
      isOwner: false,
      joinedAt: member.joinedAt,
    };

    return NextResponse.json({ success: true, data: dto }, { status: 201 });
  } catch (error) {
    console.error('POST /workspaces/:id/members error:', error);
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
    return NextResponse.json({ success: false, error: 'Failed to invite member' }, { status: 500 });
  }
}
