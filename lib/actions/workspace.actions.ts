"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUser, authorizeWorkspaceOwner, authorizeWorkspaceAccess, getWorkspaceRole } from '@/lib/auth-helpers'
import {
  addWorkspaceMemberSchema,
  inviteWorkspaceMemberByEmailSchema,
  updateWorkspaceMemberSchema,
} from '@/lib/validations'
import { z } from 'zod'
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceMemberDTO,
  WorkspaceMembersResponse,
  PrismaWorkspaceResult,
  PrismaWorkspaceMemberResult,
  PermissionLevel,
} from '@/lib/types'

// ─────────────────────────────────────────────────────────
// DTO Helpers
// ─────────────────────────────────────────────────────────

function toWorkspaceDTO(workspace: PrismaWorkspaceResult): Workspace {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    description: workspace.description,
    ownerId: workspace.ownerId,
    owner: workspace.owner,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  }
}

function toWorkspaceMemberDTO(member: PrismaWorkspaceMemberResult): WorkspaceMember {
  return {
    id: member.id,
    permission: member.permission,
    joinedAt: member.joinedAt,
    workspaceId: member.workspaceId,
    userId: member.userId,
    user: member.user,
  }
}

// ─────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────

/**
 * List all members of a workspace, including the owner.
 * Returns a unified list with an `isOwner` flag and the current user's role.
 */
export async function getWorkspaceMembers(
  workspaceId: string
): Promise<{ success: boolean; data?: WorkspaceMembersResponse; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeWorkspaceAccess(workspaceId, authUser.id)

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        owner: true,
        members: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
      },
    })

    if (!workspace) return { success: false, error: 'Workspace not found' }

    // Build unified member list: owner first, then members
    const ownerDTO: WorkspaceMemberDTO = {
      id: null,
      userId: workspace.owner.id,
      name: workspace.owner.name,
      email: workspace.owner.email,
      avatarUrl: workspace.owner.avatarUrl,
      permission: null,
      isOwner: true,
      joinedAt: null,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memberDTOs: WorkspaceMemberDTO[] = workspace.members.map((m: any) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      permission: m.permission as unknown as PermissionLevel,
      isOwner: false,
      joinedAt: m.joinedAt,
    }))

    const currentUserRole = await getWorkspaceRole(workspaceId, authUser.id)

    return {
      success: true,
      data: {
        members: [ownerDTO, ...memberDTOs],
        currentUserRole: currentUserRole ?? 'MEMBER',
      },
    }
  } catch (error) {
    console.error('Get workspace members error:', error)
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to fetch workspace members' }
  }
}

/**
 * Invite a user to the workspace by their email address.
 * Only the workspace owner can invite members.
 */
export async function inviteWorkspaceMemberByEmail(
  workspaceId: string,
  email: string,
  permission: 'LEADER' | 'EDITOR' | 'VIEWER' = 'EDITOR'
): Promise<{ success: boolean; data?: WorkspaceMember; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeWorkspaceOwner(workspaceId, authUser.id)

    const validation = inviteWorkspaceMemberByEmailSchema.parse({ email, permission })

    // Resolve email → user
    const targetUser = await prisma.user.findUnique({
      where: { email: validation.email },
    })
    if (!targetUser) {
      return { success: false, error: 'No user found with that email address' }
    }

    // Cannot invite yourself (owner)
    if (targetUser.id === authUser.id) {
      return { success: false, error: 'You cannot invite yourself to your own workspace' }
    }

    // Check if already a member
    const existing = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUser.id } },
    })
    if (existing) {
      return { success: false, error: 'User is already a member of this workspace' }
    }

    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        permission: validation.permission,
      },
      include: { user: true },
    })

    revalidatePath(`/workspaces/${workspaceId}`)
    return { success: true, data: toWorkspaceMemberDTO(member as unknown as PrismaWorkspaceMemberResult) }
  } catch (error) {
    console.error('Invite workspace member error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to invite member' }
  }
}

/**
 * Add a user to the workspace directly by their userId.
 * Only the workspace owner can add members.
 */
export async function addWorkspaceMember(
  workspaceId: string,
  userId: string,
  permission: 'LEADER' | 'EDITOR' | 'VIEWER' = 'EDITOR'
): Promise<{ success: boolean; data?: WorkspaceMember; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeWorkspaceOwner(workspaceId, authUser.id)

    const validation = addWorkspaceMemberSchema.parse({ userId, permission })

    // Cannot add yourself
    if (validation.userId === authUser.id) {
      return { success: false, error: 'You cannot add yourself as a member' }
    }

    // Ensure target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: validation.userId } })
    if (!targetUser) return { success: false, error: 'User not found' }

    // Check for existing membership
    const existing = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: validation.userId } },
    })
    if (existing) {
      return { success: false, error: 'User is already a member of this workspace' }
    }

    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: validation.userId,
        permission: validation.permission,
      },
      include: { user: true },
    })

    revalidatePath(`/workspaces/${workspaceId}`)
    return { success: true, data: toWorkspaceMemberDTO(member as unknown as PrismaWorkspaceMemberResult) }
  } catch (error) {
    console.error('Add workspace member error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to add member' }
  }
}

/**
 * Update a workspace member's permission level.
 * Only the workspace owner can change permissions.
 */
export async function updateWorkspaceMemberPermission(
  workspaceId: string,
  memberId: string,
  permission: 'LEADER' | 'EDITOR' | 'VIEWER'
): Promise<{ success: boolean; data?: WorkspaceMember; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeWorkspaceOwner(workspaceId, authUser.id)

    const validation = updateWorkspaceMemberSchema.parse({ permission })

    // Ensure the member record belongs to this workspace
    const existingMember = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    })
    if (!existingMember) {
      return { success: false, error: 'Member not found in this workspace' }
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { permission: validation.permission },
      include: { user: true },
    })

    revalidatePath(`/workspaces/${workspaceId}`)
    return { success: true, data: toWorkspaceMemberDTO(updated as unknown as PrismaWorkspaceMemberResult) }
  } catch (error) {
    console.error('Update workspace member permission error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to update member permission' }
  }
}

/**
 * Remove (kick) a member from the workspace.
 * Only the workspace owner can remove members.
 */
export async function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeWorkspaceOwner(workspaceId, authUser.id)

    // Ensure the member record belongs to this workspace
    const existingMember = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    })
    if (!existingMember) {
      return { success: false, error: 'Member not found in this workspace' }
    }

    await prisma.workspaceMember.delete({ where: { id: memberId } })

    revalidatePath(`/workspaces/${workspaceId}`)
    return { success: true }
  } catch (error) {
    console.error('Remove workspace member error:', error)
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to remove member' }
  }
}

/**
 * Leave a workspace (member-initiated).
 * Owners cannot leave their own workspace — they must transfer ownership or delete it.
 */
export async function leaveWorkspace(
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()

    // Owners cannot leave
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true },
    })
    if (!workspace) return { success: false, error: 'Workspace not found' }
    if (workspace.ownerId === authUser.id) {
      return {
        success: false,
        error: 'Owners cannot leave their own workspace. Transfer ownership or delete the workspace instead.',
      }
    }

    const memberRecord = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: authUser.id } },
    })
    if (!memberRecord) {
      return { success: false, error: 'You are not a member of this workspace' }
    }

    await prisma.workspaceMember.delete({ where: { id: memberRecord.id } })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Leave workspace error:', error)
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to leave workspace' }
  }
}

/**
 * Get all workspaces the current user owns or is a member of.
 */
export async function getUserWorkspaces(): Promise<{ success: boolean; data?: Workspace[]; error?: string }> {
  try {
    const authUser = await requireUser()

    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: authUser.id },
          { members: { some: { userId: authUser.id } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: workspaces.map((w: any) => toWorkspaceDTO(w as unknown as PrismaWorkspaceResult)),
    }
  } catch (error) {
    console.error('Get user workspaces error:', error)
    if (error instanceof Error) return { success: false, error: error.message }
    return { success: false, error: 'Failed to fetch workspaces' }
  }
}
