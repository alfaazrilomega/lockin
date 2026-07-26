'use server'

import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

// Dynamic seeding for advisor account
async function seedAdvisorData(userId: string) {
  // 1. Create default Tags
  const tagsData = [
    { name: 'Urgent', color_code: '#EB5757' },
    { name: 'Bug', color_code: '#F2C94C' },
    { name: 'Feature', color_code: '#2196F3' },
    { name: 'Marketing', color_code: '#9B51E0' }
  ]

  for (const tag of tagsData) {
    await prisma.hRTag.upsert({
      where: { name: tag.name },
      update: { color_code: tag.color_code },
      create: { name: tag.name, color_code: tag.color_code }
    })
  }

  const tags = await prisma.hRTag.findMany()
  const urgentTag = tags.find(t => t.name === 'Urgent')
  const bugTag = tags.find(t => t.name === 'Bug')
  const featTag = tags.find(t => t.name === 'Feature')
  const marketingTag = tags.find(t => t.name === 'Marketing')

  // 2. Create Tasks
  const task1 = await prisma.hRTask.create({
    data: {
      user_id: userId,
      title: 'Perbaiki Bug Login Sesi Auth',
      description: 'Ada laporan bahwa sesi login terputus otomatis setelah 1 jam di Edge browser. Investigasi middleware.',
      status: 'todo',
      position: 0,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    }
  })

  const task2 = await prisma.hRTask.create({
    data: {
      user_id: userId,
      title: 'Kembangkan Fitur Drag & Drop Kanban',
      description: 'Implementasikan @dnd-kit di sisi frontend Next.js agar perpindahan kartu tugas berjalan mulus dengan animasi GPU.',
      status: 'in_progress',
      position: 0,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  })

  const task3 = await prisma.hRTask.create({
    data: {
      user_id: userId,
      title: 'Integrasi Uji Coba Landing Page WordPress',
      description: 'Hubungkan tombol CTA landing page WordPress lokal ke halaman pendaftaran (/signup) aplikasi Next.js.',
      status: 'done',
      position: 0,
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  })

  // 3. Connect Tasks to Tags
  if (bugTag) {
    await prisma.hRTaskTag.create({
      data: { task_id: task1.id, tag_id: bugTag.id }
    })
  }
  if (urgentTag) {
    await prisma.hRTaskTag.create({
      data: { task_id: task1.id, tag_id: urgentTag.id }
    })
  }
  if (featTag) {
    await prisma.hRTaskTag.create({
      data: { task_id: task2.id, tag_id: featTag.id }
    })
  }
  if (marketingTag) {
    await prisma.hRTaskTag.create({
      data: { task_id: task3.id, tag_id: marketingTag.id }
    })
  }

  // 4. Create Comments
  await prisma.hRTaskComment.createMany({
    data: [
      {
        task_id: task1.id,
        user_id: userId,
        content: 'Saya sudah memeriksa log di Supabase Auth, sepertinya access token cookie kedaluwarsa terlalu cepat.',
      },
      {
        task_id: task2.id,
        user_id: userId,
        content: 'Desain dasarnya menggunakan Shadcn UI Card, tinggal pasang sensor dnd-kit.',
      }
    ]
  })

  // 5. Create Attachments
  await prisma.hRTaskAttachment.create({
    data: {
      task_id: task2.id,
      file_name: 'kanban_layout_v1.png',
      file_path: `${userId}/seed/kanban_layout_v1.png`,
      file_size: 1048576, // 1MB
      content_type: 'image/png'
    }
  })
}

import { getWorkspaceData } from './workspace'

export async function getTasks(workspaceSlug?: string) {
  const user = await getUser()
  const workspace = await getWorkspaceData(workspaceSlug)
  const workspaceUserIds = Array.from(new Set([
    workspace.owner_id,
    ...workspace.members.map(m => m.user_id)
  ]))

  // Dynamic seeding for advisor account if they have 0 tasks in this workspace
  if (user.email === 'AdvisorCapstone_1@gmail.com') {
    const taskCount = await prisma.hRTask.count({
      where: { user_id: { in: workspaceUserIds } }
    })
    if (taskCount === 0) {
      await seedAdvisorData(user.id)
    }
  }

  const tasks = await prisma.hRTask.findMany({
    where: { user_id: { in: workspaceUserIds } },
    include: {
      tags: {
        include: {
          tag: true
        }
      },
      comments: {
        include: {
          author: true
        },
        orderBy: {
          created_at: 'asc'
        }
      },
      attachments: true
    },
    orderBy: [
      { position: 'asc' },
      { created_at: 'desc' }
    ]
  })

  const rawPriorities: Array<{ id: string; priority: string }> = await prisma.$queryRaw`SELECT id::text, priority::text FROM public.hr_tasks WHERE user_id = ANY(${workspaceUserIds}::uuid[])`
  const priorityMap = new Map(rawPriorities.map(p => [p.id, p.priority]))

  // Query auth.users emails for all comment authors
  const commentUserIds = Array.from(new Set(tasks.flatMap(t => t.comments.map(c => c.user_id))))
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

  // Safe JSON serialization: Map BigInt in attachments to standard numbers
  return tasks.map(task => ({
    ...task,
    priority: (priorityMap.get(task.id) || 'medium') as 'low' | 'medium' | 'high',
    comments: task.comments.map(comment => {
      const email = commentEmailMap.get(comment.user_id) || ''
      const name = comment.author?.full_name || (email ? email.split('@')[0] : '') || email || 'Unknown User'
      return {
        ...comment,
        authorEmail: email,
        authorName: name
      }
    }),
    attachments: task.attachments.map(att => ({
      ...att,
      file_size: Number(att.file_size)
    }))
  }))
}

export async function createTask(formData: FormData) {
  const user = await getUser()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = (formData.get('priority') as 'low' | 'medium' | 'high') || 'medium'
  const tagIds = formData.getAll('tag_ids') as string[]
  const files = formData.getAll('files') as File[]

  if (!title || !title.trim()) {
    throw new Error('Title is required')
  }

  // 1. Create Task
  const newTask = await prisma.hRTask.create({
    data: {
      title,
      description: description || null,
      user_id: user.id,
      status: 'todo',
    },
  })

  // 1b. Update priority directly in DB
  if (priority) {
    await prisma.$executeRaw`UPDATE public.hr_tasks SET priority = ${priority} WHERE id = ${newTask.id}::uuid`
  }

  // 2. Associate Multiple Tags if selected
  if (tagIds && tagIds.length > 0) {
    for (const tagId of tagIds) {
      if (tagId && tagId.trim() !== '') {
        try {
          await prisma.hRTaskTag.create({
            data: {
              task_id: newTask.id,
              tag_id: tagId,
            }
          })
        } catch (err) {
          console.error('TaskTag create error:', err)
        }
      }
    }
  }

  // 3. Upload Multiple File Attachments if provided
  if (files && files.length > 0) {
    try {
      const supabase = await createClient()
      for (const file of files) {
        if (file && file.size > 0 && file.name) {
          const fileName = file.name
          const fileType = file.type || 'application/octet-stream'
          const fileSize = file.size

          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const filePath = `${user.id}/${newTask.id}_${Date.now()}_${fileName}`

          const { error } = await supabase.storage
            .from('attachments')
            .upload(filePath, buffer, {
              contentType: fileType,
              duplex: 'half'
            })

          if (!error) {
            await prisma.hRTaskAttachment.create({
              data: {
                task_id: newTask.id,
                file_name: fileName,
                file_path: filePath,
                file_size: BigInt(fileSize),
                content_type: fileType,
              }
            })
          } else {
            console.error('File upload error:', error)
          }
        }
      }
    } catch (err) {
      console.error('File processing error on task creation:', err)
    }
  }

  revalidatePath('/dashboard')
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'done') {
  const user = await getUser()

  await prisma.hRTask.update({
    where: {
      id: taskId,
      user_id: user.id,
    },
    data: {
      status,
    },
  })

  revalidatePath('/dashboard')
}

export async function updateTaskPriority(taskId: string, priority: string) {
  const user = await getUser()

  await prisma.$executeRaw`UPDATE public.hr_tasks SET priority = ${priority} WHERE id = ${taskId}::uuid AND user_id = ${user.id}::uuid`

  revalidatePath('/dashboard')
}

export async function updateTaskPositionBatch(orderedTaskIds: string[]) {
  const user = await getUser()

  if (!orderedTaskIds || orderedTaskIds.length === 0) return

  for (let index = 0; index < orderedTaskIds.length; index++) {
    const taskId = orderedTaskIds[index]
    await prisma.$executeRaw`UPDATE public.hr_tasks SET position = ${index} WHERE id = ${taskId}::uuid AND user_id = ${user.id}::uuid`
  }

  revalidatePath('/dashboard')
}

export async function updateTaskDescription(taskId: string, description: string) {
  const user = await getUser()

  await prisma.hRTask.update({
    where: {
      id: taskId,
      user_id: user.id,
    },
    data: {
      description,
    },
  })

  revalidatePath('/dashboard')
}

export async function updateTaskTitle(taskId: string, title: string) {
  const user = await getUser()

  await prisma.hRTask.update({
    where: {
      id: taskId,
      user_id: user.id,
    },
    data: {
      title,
    },
  })

  revalidatePath('/dashboard')
}

export async function deleteTask(taskId: string) {
  const user = await getUser()

  // 1. Clean up attached files from Supabase Storage before deleting task
  try {
    const attachments = await prisma.hRTaskAttachment.findMany({
      where: { task_id: taskId }
    })

    if (attachments.length > 0) {
      const supabase = await createClient()
      const filePaths = attachments.map(a => a.file_path)
      const { error } = await supabase.storage.from('attachments').remove(filePaths)
      if (error) {
        console.error('Storage task attachments cleanup error:', error)
      }
    }
  } catch (err) {
    console.error('Error fetching attachments for storage cleanup:', err)
  }

  // 2. Delete task from DB
  await prisma.hRTask.delete({
    where: {
      id: taskId,
      user_id: user.id,
    },
  })

  revalidatePath('/dashboard')
}

// Task Comments
export async function createComment(taskId: string, content: string) {
  const user = await getUser()
  if (!content || content.trim() === '') {
    throw new Error('Comment content cannot be empty')
  }

  const comment = await prisma.hRTaskComment.create({
    data: {
      task_id: taskId,
      user_id: user.id,
      content,
    },
    include: {
      author: true
    }
  })

  revalidatePath('/dashboard')
  return {
    ...comment,
    authorEmail: user.email || '',
    authorName: comment.author?.full_name || user.email?.split('@')[0] || user.email || 'Unknown User'
  }
}

// Task Tags
export async function getTags() {
  await getUser() // Ensure authenticated
  return await prisma.hRTag.findMany()
}

export async function addTagToTask(taskId: string, tagId: string) {
  const user = await getUser()

  // Verify task ownership
  const task = await prisma.hRTask.findUnique({
    where: { id: taskId, user_id: user.id }
  })
  if (!task) throw new Error('Task not found')

  await prisma.hRTaskTag.upsert({
    where: {
      task_id_tag_id: {
        task_id: taskId,
        tag_id: tagId
      }
    },
    create: {
      task_id: taskId,
      tag_id: tagId
    },
    update: {}
  })

  revalidatePath('/dashboard')
}

export async function removeTagFromTask(taskId: string, tagId: string) {
  const user = await getUser()

  // Verify task ownership
  const task = await prisma.hRTask.findUnique({
    where: { id: taskId, user_id: user.id }
  })
  if (!task) throw new Error('Task not found')

  await prisma.hRTaskTag.delete({
    where: {
      task_id_tag_id: {
        task_id: taskId,
        tag_id: tagId
      }
    }
  })

  revalidatePath('/dashboard')
}

// Task Attachments
export async function createAttachment(taskId: string, formData: FormData) {
  const user = await getUser()
  const files = formData.getAll('files') as File[]
  const singleFile = formData.get('file') as File | null
  const fileList = files.length > 0 ? files : (singleFile ? [singleFile] : [])

  if (fileList.length === 0) throw new Error('No file provided')

  const supabase = await createClient()

  for (const file of fileList) {
    if (file && file.size > 0 && file.name) {
      const fileName = file.name
      const fileType = file.type || 'application/octet-stream'
      const fileSize = file.size
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = `${user.id}/${taskId}_${Date.now()}_${fileName}`

      const { error } = await supabase.storage
        .from('attachments')
        .upload(filePath, buffer, {
          contentType: fileType,
          duplex: 'half'
        })

      if (error) {
        console.error('Storage upload error:', error)
        continue
      }

      await prisma.hRTaskAttachment.create({
        data: {
          task_id: taskId,
          file_name: fileName,
          file_path: filePath,
          file_size: BigInt(fileSize),
          content_type: fileType,
        }
      })
    }
  }

  revalidatePath('/dashboard')
}

export async function deleteAttachment(attachmentId: string) {
  const user = await getUser()

  // Find attachment
  const attachment = await prisma.hRTaskAttachment.findUnique({
    where: { id: attachmentId },
    include: { task: true }
  })

  // If already deleted or doesn't exist, return gracefully
  if (!attachment) {
    revalidatePath('/dashboard')
    return
  }

  // Delete from Supabase Storage
  try {
    const supabase = await createClient()
    const { error } = await supabase.storage
      .from('attachments')
      .remove([attachment.file_path])

    if (error) {
      console.error('Storage delete error:', error)
    }
  } catch (err) {
    console.error('Error removing file from storage:', err)
  }

  // Delete record from DB
  try {
    await prisma.hRTaskAttachment.delete({
      where: { id: attachmentId }
    })
  } catch (err) {
    console.error('Error deleting attachment record:', err)
  }

  revalidatePath('/dashboard')
}
