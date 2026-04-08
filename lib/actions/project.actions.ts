"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUser, authorizeProjectModify, isProjectMember } from '@/lib/auth-helpers'
import { createProjectSchema, updateProjectSchema, addMemberSchema } from '@/lib/validations'
import { z } from 'zod'
import { type Project, type ProjectMember, type CreateProjectForm, type PrismaProjectResult, type PrismaProjectMemberResult } from '@/lib/types'

// Helper function to transform Prisma Project to API response type
function toProjectDTO(project: PrismaProjectResult): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    progress: project.progress,
    deadline: project.deadline,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    ownerId: project.ownerId,
    _count: project._count,
    owner: project.owner,
    members: project.members,
    tasks: project.tasks,
    notes: project.notes,
  }
}

// Helper function to transform Prisma ProjectMember to API response type
function toProjectMemberDTO(member: PrismaProjectMemberResult): ProjectMember {
  return {
    id: member.id,
    roleName: member.roleName,
    permission: member.permission,
    joinedAt: member.joinedAt,
    projectId: member.projectId,
    userId: member.userId,
    project: member.project,
    user: member.user,
  }
}

export async function createProject(data: CreateProjectForm): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    // Validate input
    const validation = createProjectSchema.parse(data)

    // Authorize user
    const authUser = await requireUser()

    // Ensure user has a Personal Workspace
    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: authUser.id, name: 'Personal Workspace' }
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Personal Workspace',
          slug: `personal-${authUser.id.substring(0, 8)}`,
          description: 'Your default personal workspace.',
          ownerId: authUser.id,
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        name: validation.name,
        description: validation.description,
        deadline: validation.deadline,
        ownerId: authUser.id,
        workspaceId: workspace.id,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) }
  } catch (error) {
    console.error('Create project error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create project' }
  }
}

export async function getUserProjects(userId: string): Promise<{ success: boolean; data?: Project[]; error?: string }> {
  try {
    // Verify user exists
    const dbUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!dbUser) {
      return { success: false, error: 'User account not found' }
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, data: projects.map((p: any) => toProjectDTO(p as unknown as PrismaProjectResult)) }
  } catch (error) {
    console.error('Get user projects error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProjectById(id: string): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        notes: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    return { success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) }
  } catch (error) {
    console.error('Get project by ID error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function updateProjectProgress(
  projectId: string,
  progress: number
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    // Authorize - user must be project member
    const authUser = await requireUser()
    await authorizeProjectModify(projectId, authUser.id)

    // Validate progress
    const clampedProgress = Math.max(0, Math.min(100, progress))

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        progress: clampedProgress,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath('/dashboard')

    return { success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) }
  } catch (error) {
    console.error('Update project progress error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update project progress' }
  }
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  roleName: string,
  permission: 'LEADER' | 'EDITOR' | 'VIEWER' = 'EDITOR'
): Promise<{ success: boolean; data?: ProjectMember; error?: string }> {
  try {
    // Authorize - only project members can add members (only leader should add, but checking member for now)
    const authUser = await requireUser()
    await authorizeProjectModify(projectId, authUser.id)

    // Validate input
    const validation = addMemberSchema.parse({
      userId,
      roleName,
      permission,
    })

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: validation.userId,
        roleName: validation.roleName,
        permission: validation.permission,
      },
      include: {
        user: true,
        project: true,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, data: toProjectMemberDTO(member as unknown as PrismaProjectMemberResult) }
  } catch (error) {
    console.error('Add project member error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to add project member' }
  }
}

export async function updateProject(
  projectId: string,
  data: Partial<z.infer<typeof updateProjectSchema>>
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeProjectModify(projectId, authUser.id)

    // Only validate provided fields
    const validation = updateProjectSchema.partial().parse(data)

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: validation.name,
        description: validation.description,
        deadline: validation.deadline,
        progress: validation.progress,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath('/dashboard')

    return { success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) }
  } catch (error) {
    console.error('Update project error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()

    // Only the project owner can delete
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    if (project.ownerId !== authUser.id) {
      return { success: false, error: 'Unauthorized: Only the project owner can delete this project' }
    }

    await prisma.project.delete({
      where: { id: projectId },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')

    return { success: true }
  } catch (error) {
    console.error('Delete project error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete project' }
  }
}

