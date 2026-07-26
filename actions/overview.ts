'use server'

import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { getWorkspaceData } from './workspace'

export async function getUserSessionData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    provider: 'email',
    role: 'authenticated'
  }
}

export async function getActivityLogs(workspaceSlug?: string) {
  const workspace = await getWorkspaceData(workspaceSlug)
  const workspaceUserIds = Array.from(new Set([
    workspace.owner_id,
    ...workspace.members.map(m => m.user_id)
  ]))

  const logs = await prisma.hRActivityLog.findMany({
    where: {
      user_id: { in: workspaceUserIds }
    },
    take: 8,
    orderBy: {
      created_at: 'desc'
    },
    include: {
      user: true
    }
  })

  return logs.map(log => ({
    id: log.id,
    action: log.action,
    task_id: log.task_id,
    created_at: log.created_at,
    userName: log.user?.full_name || 'System Member',
    userAvatar: log.user?.avatar_url,
    snapshot: log.state_snapshot,
    taskTitle: (log.state_snapshot as any)?.title || 'Tugas HR'
  }))
}

export async function getStorageUsageData(workspaceSlug?: string) {
  const workspace = await getWorkspaceData(workspaceSlug)
  const workspaceUserIds = Array.from(new Set([
    workspace.owner_id,
    ...workspace.members.map(m => m.user_id)
  ]))

  const attachments = await prisma.hRTaskAttachment.findMany({
    where: {
      task: {
        user_id: { in: workspaceUserIds }
      }
    }
  })

  const totalFiles = attachments.length
  const totalBytes = attachments.reduce((sum, a) => sum + Number(a.file_size), 0)
  const totalMB = Number((totalBytes / (1024 * 1024)).toFixed(2))

  const LIMIT_MB = 100
  const percentage = Math.min(100, Math.round((totalMB / LIMIT_MB) * 100))

  return {
    totalFiles,
    totalBytes,
    totalMB,
    usedMB: totalMB,
    limitMB: LIMIT_MB,
    quotaMB: LIMIT_MB,
    percentage
  }
}

export async function getTaskTimeline(taskId: string) {
  const user = await getUserSessionData()
  if (!user) throw new Error('Unauthorized')

  const task = await prisma.hRTask.findUnique({
    where: { id: taskId },
    include: {
      owner: true,
      comments: {
        include: { author: true },
        orderBy: { created_at: 'desc' }
      },
      attachments: {
        orderBy: { created_at: 'desc' }
      },
      tags: {
        include: { tag: true }
      }
    }
  })

  if (!task) throw new Error('Task not found')

  // Fetch raw priority from PostgreSQL DB
  const rawPriority: Array<{ priority: string }> = await prisma.$queryRaw`SELECT priority::text FROM public.hr_tasks WHERE id = ${taskId}::uuid`
  const priorityValue = (rawPriority[0]?.priority || (task as any).priority || 'medium').toLowerCase()

  // 2. Fetch Activity Logs for timeline
  const hRActivityLogs = await prisma.hRActivityLog.findMany({
    where: {
      OR: [
        { task_id: taskId },
        { user_id: task.user_id }
      ]
    },
    orderBy: { created_at: 'asc' },
    include: { user: true }
  })

  const taskLogs = hRActivityLogs.filter(log =>
    log.task_id === taskId ||
    (log.state_snapshot as any)?.id === taskId ||
    (log.state_snapshot as any)?.title === task.title
  )

  // Enrich comment authors with auth.users emails
  const commentUserIds = Array.from(new Set(task.comments.map(c => c.user_id)))
  let commentEmailMap = new Map<string, string>()

  if (commentUserIds.length > 0) {
    try {
      const authUsers: Array<{ id: string; email: string }> = await prisma.$queryRaw`
        SELECT id::text, email::text FROM auth.users WHERE id = ANY(${commentUserIds}::uuid[])
      `
      commentEmailMap = new Map(authUsers.map(u => [u.id, u.email]))
    } catch (err) {
      console.error('Error fetching comment author emails:', err)
    }
  }

  const enrichedComments = task.comments.map(comment => {
    const email = commentEmailMap.get(comment.user_id) || ''
    const name = comment.author?.full_name || (email ? email.split('@')[0] : '') || email || 'Unknown User'
    return {
      ...comment,
      authorEmail: email,
      authorName: name
    }
  })

  return {
    task: {
      ...task,
      comments: enrichedComments,
      priority: priorityValue as 'low' | 'medium' | 'high',
      attachments: task.attachments.map(att => ({
        ...att,
        file_size: Number(att.file_size)
      }))
    },
    timeline: taskLogs.map(log => ({
      id: log.id,
      action: log.action,
      created_at: log.created_at,
      userName: log.user?.full_name || 'System Member',
      userAvatar: log.user?.avatar_url,
      snapshot: log.state_snapshot
    }))
  }
}
