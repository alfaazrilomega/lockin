"use server"

import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth-helpers'
import { type DashboardStats, type Project, type Task, type CalendarEvent, type PrismaProjectResult, type PrismaTaskResult } from '@/lib/types'


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
    // Optional relations
    owner: project.owner,
    members: project.members,
    tasks: project.tasks,
    notes: project.notes,
  }
}

// Helper function to transform Prisma Task to API response type
function toTaskDTO(task: PrismaTaskResult): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    deadline: task.deadline,
    proofUrl: task.proofUrl,
    proofNotes: task.proofNotes,
    feedback: task.feedback,
    projectId: task.projectId,
    order: task.order,
    workspaceId: task.workspaceId,
    assigneeId: task.assigneeId,
    project: task.project,
    workspace: task.workspace,
    assignee: task.assignee,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }
}

export async function getCalendarEvents(): Promise<{ success: boolean; data?: CalendarEvent[]; error?: string }> {
  try {
    const authUser = await requireUser()
    const userId = authUser.id

    const [tasks, notes] = await Promise.all([
      prisma.task.findMany({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } }
            ]
          },
          deadline: { not: null }
        },
        select: { id: true, title: true, deadline: true, projectId: true }
      }),
      prisma.note.findMany({
        where: { authorId: userId, meetingDate: { not: null } },
        select: { id: true, title: true, meetingDate: true, projectId: true }
      })
    ])

    const events: CalendarEvent[] = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        start: t.deadline!,
        end: t.deadline!,
        type: 'deadline' as const,
        projectId: t.projectId ?? undefined,
        taskId: t.id
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...notes.map((n: any) => ({
        id: n.id,
        title: n.title,
        start: n.meetingDate!,
        end: n.meetingDate!,
        type: 'meeting' as const,
        projectId: n.projectId ?? undefined,
        noteId: n.id
      }))
    ]

    return { success: true, data: events }
  } catch (error) {
    console.error('Get calendar events error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch calendar events' }
  }
}

export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    const authUser = await requireUser()
    const userId = authUser.id

    const [totalProjects, activeTasks, completedTasks, upcomingDeadlines, recentProjects, upcomingDeadlineTasks] = await Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } }
            ]
          },
          status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW', 'REVISION'] }
        }
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } }
            ]
          },
          status: 'DONE'
        }
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } }
            ]
          },
          deadline: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            gte: new Date()
          },
          status: { not: 'DONE' }
        }
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        include: {
          _count: { select: { tasks: true } }
        }
      }),
      prisma.task.findMany({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } }
            ]
          },
          deadline: {
            not: null,
            gte: new Date()
          },
          status: { not: 'DONE' }
        },
        orderBy: { deadline: 'asc' },
        take: 3,
        include: { project: true }
      })
    ])

    return {
      success: true,
      data: {
        totalProjects,
        activeTasks,
        completedTasks,
        upcomingDeadlines,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recentProjects: recentProjects.map((p: any) => toProjectDTO(p as unknown as PrismaProjectResult)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        upcomingDeadlineTasks: upcomingDeadlineTasks.map((t: any) => toTaskDTO(t as unknown as PrismaTaskResult))
      }
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch dashboard stats' }
  }
}