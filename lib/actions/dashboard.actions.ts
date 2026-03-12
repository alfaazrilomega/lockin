"use server"

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { type DashboardStats, type Project, type Task, type CalendarEvent } from '@/lib/types'

export async function getCalendarEvents(): Promise<{ success: boolean; data?: CalendarEvent[]; error?: string }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const userId = user.id

    const [tasks, notes] = await Promise.all([
      prisma.task.findMany({
        where: {
          project: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
          deadline: { not: null },
        },
        select: { id: true, title: true, deadline: true, projectId: true },
      }),
      prisma.note.findMany({
        where: { authorId: userId, meetingDate: { not: null } },
        select: { id: true, title: true, meetingDate: true, projectId: true },
      }),
    ])

    const events: CalendarEvent[] = [
      ...tasks.map((t) => ({
        id: t.id,
        title: t.title,
        start: t.deadline!,
        end: t.deadline!,
        type: 'deadline' as const,
        projectId: t.projectId,
        taskId: t.id,
      })),
      ...notes.map((n) => ({
        id: n.id,
        title: n.title,
        start: n.meetingDate!,
        end: n.meetingDate!,
        type: 'meeting' as const,
        projectId: n.projectId ?? undefined,
        noteId: n.id,
      })),
    ]

    return { success: true, data: events }
  } catch (error) {
    console.error('Get calendar events error:', error)
    return { success: false, error: 'Failed to fetch calendar events' }
  }
}



export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const userId = user.id

    const [totalProjects, activeTasks, completedTasks, upcomingDeadlines, recentProjects, upcomingDeadlineTasks] = await Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } },
            ],
          },
          status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW', 'REVISION'] as const },
        },
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } },
            ],
          },
          status: 'DONE',
        },
      }),
      prisma.task.count({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } },
            ],
          },
          deadline: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
            gte: new Date(),
          },
          status: { not: 'DONE' },
        },
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        include: {
          _count: {
            select: { tasks: true }
          }
        }
      }),
      prisma.task.findMany({
        where: {
          project: {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } },
            ],
          },
          deadline: {
            not: null,
            gte: new Date(),
          },
          status: { not: 'DONE' },
        },
        orderBy: { deadline: 'asc' },
        take: 3,
        include: {
          project: true
        }
      }),
    ])

    return {
      success: true,
      data: {
        totalProjects,
        activeTasks,
        completedTasks,
        upcomingDeadlines,
        recentProjects: recentProjects as unknown as Project[],
        upcomingDeadlineTasks: upcomingDeadlineTasks as unknown as Task[],
      },
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return { success: false, error: 'Failed to fetch dashboard stats' }
  }
}
