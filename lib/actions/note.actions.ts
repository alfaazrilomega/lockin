"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUser, authorizeNoteModify, authorizeNoteAccess, isProjectMember } from '@/lib/auth-helpers'
import { createNoteSchema } from '@/lib/validations'
import { z } from 'zod'
import { type Note, type CreateNoteForm, type PrismaNoteResult } from '@/lib/types'

// Helper function to transform Prisma Note to API response type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNoteDTO(note: any): Note {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    audioUrl: note.audioUrl,
    transcript: note.transcript,
    summary: note.summary,
    meetingDate: note.meetingDate,
    authorId: note.authorId,
    projectId: note.projectId,
    author: note.author,
    project: note.project,
    flashcardDecks: note.flashcardDecks,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }
}

export async function createNote(data: CreateNoteForm): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    // Validate input
    const validation = createNoteSchema.parse(data)

    // Authorize user
    const authUser = await requireUser()

    // If projectId provided, verify user is a member
    if (validation.projectId) {
      await isProjectMember(validation.projectId, authUser.id)
    }

    const note = await prisma.note.create({
      data: {
        title: validation.title,
        content: validation.content,
        projectId: validation.projectId,
        meetingDate: validation.meetingDate,
        authorId: authUser.id,
      },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    revalidatePath('/dashboard')
    if (validation.projectId) {
      revalidatePath(`/dashboard/projects/${validation.projectId}`)
    }

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Create note error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create note' }
  }
}

export async function getProjectNotes(projectId: string): Promise<{ success: boolean; data?: Note[]; error?: string }> {
  try {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const notes = await prisma.note.findMany({
      where: { projectId },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: notes.map(toNoteDTO) }
  } catch (error) {
    console.error('Get project notes error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch notes' }
  }
}

export async function updateNoteContent(
  noteId: string,
  content: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteModify(noteId, authUser.id)

    // Basic validation for content length
    if (content && content.length > 50000) {
      return { success: false, error: 'Content exceeds maximum length of 50000 characters' }
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { content },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    if (note.projectId) {
      revalidatePath(`/dashboard/projects/${note.projectId}`)
    }
    revalidatePath('/dashboard')

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Update note content error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update note content' }
  }
}

export async function saveTranscript(
  noteId: string,
  transcript: string,
  summary: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteModify(noteId, authUser.id)

    // Validate transcript and summary lengths
    if (transcript && transcript.length > 100000) {
      return { success: false, error: 'Transcript exceeds maximum length' }
    }
    if (summary && summary.length > 5000) {
      return { success: false, error: 'Summary exceeds maximum length' }
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        transcript,
        summary,
      },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    if (note.projectId) {
      revalidatePath(`/dashboard/projects/${note.projectId}`)
    }
    revalidatePath('/dashboard')

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Save transcript error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to save transcript' }
  }
}

export async function getNoteById(id: string): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteAccess(id, authUser.id)

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        author: true,
        project: true,
        flashcardDecks: {
          include: {
            cards: true,
          },
        },
      },
    })

    if (!note) {
      return { success: false, error: 'Note not found' }
    }

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Get note by ID error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch note' }
  }
}

export async function uploadAudio(
  noteId: string,
  audioUrl: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteModify(noteId, authUser.id)

    // Basic URL validation
    if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
      return { success: false, error: 'Invalid audio URL' }
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { audioUrl },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    if (note.projectId) {
      revalidatePath(`/dashboard/projects/${note.projectId}`)
    }
    revalidatePath('/dashboard')

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Upload audio error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to upload audio' }
  }
}

export async function getUserNotes(userId: string): Promise<{ success: boolean; data?: Note[]; error?: string }> {
  try {
    // Verify user exists
    const dbUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!dbUser) {
      return { success: false, error: 'User account not found' }
    }

    const notes = await prisma.note.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: notes.map(toNoteDTO) }
  } catch (error) {
    console.error('Get user notes error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch notes' }
  }
}

export async function updateNoteMetadata(
  noteId: string,
  data: { title?: string; meetingDate?: Date | null }
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteModify(noteId, authUser.id)

    // Validate title if provided
    if (data.title && (data.title.length < 1 || data.title.length > 200)) {
      return { success: false, error: 'Title must be between 1 and 200 characters' }
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: data.title,
        meetingDate: data.meetingDate,
      },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    if (note.projectId) {
      revalidatePath(`/dashboard/projects/${note.projectId}`)
    }
    revalidatePath('/dashboard')

    return { success: true, data: toNoteDTO(note) }
  } catch (error) {
    console.error('Update note metadata error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update note metadata' }
  }
}

export async function deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeNoteModify(noteId, authUser.id)

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { projectId: true },
    })

    if (!note) {
      return { success: false, error: 'Note not found' }
    }

    await prisma.note.delete({
      where: { id: noteId },
    })

    if (note.projectId) {
      revalidatePath(`/dashboard/projects/${note.projectId}`)
    }
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/notes')

    return { success: true }
  } catch (error) {
    console.error('Delete note error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete note' }
  }
}
