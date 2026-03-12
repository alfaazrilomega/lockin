"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { type CreateTaskForm, type Task } from '@/lib/types'
import { TaskStatus as PrismaTaskStatus } from '@prisma/client'

export async function createTask(data: CreateTaskForm): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as PrismaTaskStatus,
        deadline: data.deadline,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
      },
      include: {
        project: true,
        assignee: true,
      },
    })

    revalidatePath(`/dashboard/projects/${data.projectId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: task as unknown as Task }
  } catch (error) {
    console.error('Create task error:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

export async function getProjectTasks(projectId: string): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        project: true,
        assignee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: tasks as unknown as Task[] }
  } catch (error) {
    console.error('Get project tasks error:', error)
    return { success: false, error: 'Failed to fetch tasks' }
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: PrismaTaskStatus
): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: status as PrismaTaskStatus },
      include: {
        project: true,
        assignee: true,
      },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: task as unknown as Task }
  } catch (error) {
    console.error('Update task status error:', error)
    return { success: false, error: 'Failed to update task status' }
  }
}

export async function updateTask(
  taskId: string,
  data: Partial<CreateTaskForm>
): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as PrismaTaskStatus | undefined,
        deadline: data.deadline,
        assigneeId: data.assigneeId,
      },
      include: {
        project: true,
        assignee: true,
      },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: task as unknown as Task }
  } catch (error) {
    console.error('Update task error:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

export async function deleteTask(taskId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Delete task error:', error)
    return { success: false, error: 'Failed to delete task' }
  }
}

export async function getTaskById(id: string): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
      },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    return { success: true, data: task as unknown as Task }
  } catch (error) {
    console.error('Get task by ID error:', error)
    return { success: false, error: 'Failed to fetch task' }
  }
}