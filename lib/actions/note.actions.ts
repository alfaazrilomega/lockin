"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { type CreateNoteForm, type Note } from '@/lib/types'

export async function createNote(data: CreateNoteForm): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        projectId: data.projectId,
        meetingDate: data.meetingDate,
        authorId: user.id,
      },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    revalidatePath('/dashboard')
    if (data.projectId) {
      revalidatePath(`/dashboard/projects/${data.projectId}`)
    }
    
    return { success: true, data: note }
  } catch (error) {
    console.error('Create note error:', error)
    return { success: false, error: 'Failed to create note' }
  }
}

export async function getProjectNotes(projectId: string): Promise<{ success: boolean; data?: Note[]; error?: string }> {
  try {
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

    return { success: true, data: notes }
  } catch (error) {
    console.error('Get project notes error:', error)
    return { success: false, error: 'Failed to fetch notes' }
  }
}

export async function updateNoteContent(
  noteId: string,
  content: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
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
    
    return { success: true, data: note }
  } catch (error) {
    console.error('Update note content error:', error)
    return { success: false, error: 'Failed to update note content' }
  }
}

export async function saveTranscript(
  noteId: string,
  transcript: string,
  summary: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
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
    
    return { success: true, data: note }
  } catch (error) {
    console.error('Save transcript error:', error)
    return { success: false, error: 'Failed to save transcript' }
  }
}

export async function getNoteById(id: string): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
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

    return { success: true, data: note }
  } catch (error) {
    console.error('Get note by ID error:', error)
    return { success: false, error: 'Failed to fetch note' }
  }
}

export async function uploadAudio(
  noteId: string,
  audioUrl: string
): Promise<{ success: boolean; data?: Note; error?: string }> {
  try {
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
    
    return { success: true, data: note }
  } catch (error) {
    console.error('Upload audio error:', error)
    return { success: false, error: 'Failed to upload audio' }
  }
}

export async function getUserNotes(userId: string): Promise<{ success: boolean; data?: Note[]; error?: string }> {
  try {
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

    return { success: true, data: notes }
  } catch (error) {
    console.error('Get user notes error:', error)
    return { success: false, error: 'Failed to fetch notes' }
  }
}