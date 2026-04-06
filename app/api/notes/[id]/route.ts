import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser, authorizeNoteAccess, authorizeNoteModify } from '@/lib/auth-helpers'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const authUser = await requireUser()

    await authorizeNoteAccess(noteId, authUser.id)

    const note = await prisma.note.findUnique({
      where: { id: noteId },
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
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: note }, { status: 200 })
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const authUser = await requireUser()
    
    await authorizeNoteModify(noteId, authUser.id)
    
    const body = await req.json()
    const { content, title, meetingDate, transcript, summary, audioUrl } = body

    // Create an update object dynamically based on what's provided
    const updateData: Record<string, unknown> = {}
    if (content !== undefined) updateData.content = content
    if (title !== undefined) updateData.title = title
    if (meetingDate !== undefined) updateData.meetingDate = meetingDate
    if (transcript !== undefined) updateData.transcript = transcript
    if (summary !== undefined) updateData.summary = summary
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl

    const note = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: {
        author: true,
        project: true,
        flashcardDecks: true,
      },
    })

    return NextResponse.json({ success: true, data: note }, { status: 200 })
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const authUser = await requireUser()
    
    await authorizeNoteModify(noteId, authUser.id)

    await prisma.note.delete({
      where: { id: noteId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 })
  }
}
