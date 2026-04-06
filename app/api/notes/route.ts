import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser, isProjectMember } from '@/lib/auth-helpers'
import { createNoteSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(_req: Request) {
  try {
    const authUser = await requireUser()

    const notes = await prisma.note.findMany({
      where: { authorId: authUser.id },
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: notes }, { status: 200 })
  } catch (error) {
    console.error('GET /api/notes error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireUser()
    const body = await req.json()
    
    // Validate input using Zod
    const validation = createNoteSchema.parse(body)

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

    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch (error) {
    console.error('POST /api/notes error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
