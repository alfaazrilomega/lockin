import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const authUser = await requireUser()
    const userId = authUser.id

    const prismaUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!prismaUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User not found in database' }, { status: 401 })
    }

    const now = new Date()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Parallel fetch of God-Tier Dashboard Analytics
    const [
      totalProjects,
      allActiveTasks,
      completedRecentTasks,
      urgentPriorities,
      recentProjects,
      upcomingDeadlineTasks,
      blockerAlerts,
      personalTasks
    ] = await Promise.all([
      // 1. Projects Count
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ],
          status: { in: ['ACTIVE', 'PLANNING'] }
        }
      }),
      
      // 2. All Active Team Tasks (Assigned to Me)
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW', 'REVISION'] }
        },
        include: {
          project: { select: { id: true, name: true } },
          epic: { select: { id: true, title: true } }
        }
      }),

      // 3. Velocity / Productivity (Tasks completed last 7 days)
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          status: 'DONE',
          updatedAt: { gte: sevenDaysAgo }
        },
        select: { storyPoints: true, timeSpent: true }
      }),

      // 4. Burn-down & Urgent Matrix (Tasks assigned to me flagged as HIGH)
      prisma.task.count({
        where: {
          assigneeId: userId,
          priority: 'HIGH',
          status: { not: 'DONE' }
        }
      }),

      // 5. Recent Workspaces / Projects
      prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        },
        orderBy: { updatedAt: 'desc' },
        take: 4,
        select: {
          id: true,
          name: true,
          status: true,
          progress: true,
          _count: { select: { tasks: true, epics: true, milestones: true } }
        }
      }),

      // 6. Imminent Deadlines
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          deadline: {
            not: null,
            gte: now,
            lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          },
          status: { not: 'DONE' }
        },
        orderBy: { deadline: 'asc' },
        take: 5,
        include: { project: { select: { id: true, name: true } } }
      }),

      // 7. Blocker Alerts (Tasks I own that are blocked by uncompleted tasks)
      prisma.taskDependency.findMany({
        where: {
          blockedByTask: { assigneeId: userId, status: { not: 'DONE' } }
        },
        include: {
          blockingTask: {
            select: { id: true, title: true, assignee: { select: { name: true } } }
          }
        },
        take: 3
      }),

      // 8. Personal Private Tasks
      prisma.personalTask.findMany({
        where: {
          userId: userId,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        },
        orderBy: { priority: 'asc' },
        take: 5,
      })
    ])

    // Calculate Velocity Metrics (Sum of Story Points completed recently)
    const velocityPoints = completedRecentTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
    const totalTimeSpent = completedRecentTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0)

    // Construct the "Dadmin / Linear" God-Tier JSON response
    return NextResponse.json({
      success: true,
      data: {
        workload: {
          totalOpenProjects: totalProjects,
          activeTaskCount: allActiveTasks.length,
          urgentTaskCount: urgentPriorities,
          personalTaskCount: personalTasks.length
        },
        velocity: {
          completedLast7Days: completedRecentTasks.length,
          storyPointsBurned: velocityPoints,
          minutesSpentLogged: totalTimeSpent
        },
        intelligence: {
          swimlanes: allActiveTasks, // Frontend can group this by Priority or Epic
          blockers: blockerAlerts,
          upcomingDeadlines: upcomingDeadlineTasks,
          recentProjects: recentProjects,
          priorityFocus: personalTasks // Giving users their daily focus
        }
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get god-tier dashboard stats API error:', error)
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return NextResponse.json({ success: false, error: 'Failed to compute dashboard analytics' }, { status: 500 })
  }
}
