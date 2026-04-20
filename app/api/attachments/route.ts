import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';

export async function GET(req: Request) {
  try {
    const authUser = await requireUser();
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get('noteId');

    // Base query ensures security: users only see their own files
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      uploaderId: authUser.id,
    };

    if (noteId) {
      whereClause.noteId = noteId;
    }

    const attachments = await prisma.attachment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: attachments }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch attachments error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch files' }, { status: 500 });
  }
}
