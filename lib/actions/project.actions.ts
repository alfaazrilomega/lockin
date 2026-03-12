"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { type CreateProjectForm, type Project, type ProjectMember } from '@/lib/types'

export async function createProject(data: CreateProjectForm): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        deadline: data.deadline,
        ownerId: user.id,
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
        notes: true,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, data: project as unknown as Project }
  } catch (error) {
    console.error('Create project error:', error)
    return { success: false, error: 'Failed to create project' }
  }
}

export async function getUserProjects(userId: string): Promise<{ success: boolean; data?: Project[]; error?: string }> {
  try {
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

    return { success: true, data: projects as unknown as Project[] }
  } catch (error) {
    console.error('Get user projects error:', error)
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

    return { success: true, data: project as unknown as Project }
  } catch (error) {
    console.error('Get project by ID error:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function updateProjectProgress(
  projectId: string,
  progress: number
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.max(0, Math.min(100, progress))

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        progress: clampedProgress,
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
        notes: true,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: project as unknown as Project }
  } catch (error) {
    console.error('Update project progress error:', error)
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
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        roleName: roleName,
        permission: permission as 'LEADER' | 'EDITOR' | 'VIEWER',
      },
      include: {
        user: true,
        project: true,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, data: member as unknown as ProjectMember }
  } catch (error) {
    console.error('Add project member error:', error)
    return { success: false, error: 'Failed to add project member' }
  }
}