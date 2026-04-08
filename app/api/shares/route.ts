import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { createShareSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET() {
  try {
    const authUser = await requireUser();

    // Fetch shared WITH me (excluding CANCELLED and REJECTED shares)
    const sharedWithMe = await prisma.sharedResource.findMany({
      where: {
        receiverId: authUser.id,
        status: {
          notIn: ['CANCELLED', 'REJECTED']
        }
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        project: true,
        note: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch shared BY me
    const sharedByMe = await prisma.sharedResource.findMany({
      where: {
        senderId: authUser.id,
      },
      include: {
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        project: true,
        note: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        sharedWithMe,
        sharedByMe,
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch shares' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await requireUser();
    const body = await request.json();
    const validation = createShareSchema.parse(body);

    const { itemType, itemId, receiverId, permission } = validation;

    // 1. No self-share guard
    if (authUser.id === receiverId) {
      return NextResponse.json({ success: false, error: 'Cannot share resource with yourself' }, { status: 400 });
    }

    // 2. Validate receiver exists
    const receiverUser = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiverUser) {
        return NextResponse.json({ success: false, error: 'Receiver not found' }, { status: 404 });
    }

    // 3. Validation and Ownership Check
    let projectId = null;
    let noteId = null;

    if (itemType === 'PROJECT') {
      projectId = itemId;
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      if (project.ownerId !== authUser.id) return NextResponse.json({ success: false, error: 'Only the project owner can share this project' }, { status: 403 });
    } else if (itemType === 'NOTE') {
      noteId = itemId;
      const note = await prisma.note.findUnique({ where: { id: noteId } });
      if (!note) return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      if (note.authorId !== authUser.id) return NextResponse.json({ success: false, error: 'Only the note author can share this note' }, { status: 403 });
    } else {
       return NextResponse.json({ success: false, error: 'Invalid itemType' }, { status: 400 });
    }

    // 4. Duplicate share guard
    const existingShare = await prisma.sharedResource.findFirst({
      where: {
        senderId: authUser.id,
        receiverId,
        itemType,
        projectId: projectId ?? undefined,
        noteId: noteId ?? undefined,
        status: { not: 'CANCELLED' },
      }
    });

    if (existingShare) {
      return NextResponse.json({ success: false, error: 'You have already shared this resource with this user' }, { status: 400 });
    }

    // Create the share
    const share = await prisma.sharedResource.create({
      data: {
        itemType,
        senderId: authUser.id,
        receiverId,
        permission,
        projectId,
        noteId,
        status: 'PENDING',
      },
      include: {
        receiver: { select: { id: true, name: true, email: true, avatarUrl: true } },
        project: true,
        note: true,
      }
    });

    return NextResponse.json({ success: true, data: share }, { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    console.error('Create share error', error);
    return NextResponse.json({ success: false, error: 'Failed to create share request' }, { status: 500 });
  }
}
