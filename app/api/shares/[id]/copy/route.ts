import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: shareId } = await params;
    const authUser = await requireUser();

    const share = await prisma.sharedResource.findUnique({
      where: { id: shareId },
      include: {
        project: {
          include: { tasks: true }
        },
        note: true,
      }
    });

    if (!share) {
      return NextResponse.json({ success: false, error: 'Share request not found' }, { status: 404 });
    }

    if (share.receiverId !== authUser.id) {
       return NextResponse.json({ success: false, error: 'Forbidden. Only the receiver can copy this resource.' }, { status: 403 });
    }

    if (share.status !== 'ACCEPTED') {
        return NextResponse.json({ success: false, error: 'Cannot copy a resource that is not ACCEPTED' }, { status: 400 });
    }

    if (share.permission !== 'COPY') {
        return NextResponse.json({ success: false, error: 'You do not have permission to copy this resource' }, { status: 403 });
    }

    if (share.itemType === 'PROJECT' && share.project) {
        // Ensure user has a Personal Workspace to attach the cloned project
        let workspace = await prisma.workspace.findFirst({
            where: { ownerId: authUser.id, name: 'Personal Workspace' }
        });
      
        if (!workspace) {
            workspace = await prisma.workspace.create({
              data: {
                name: 'Personal Workspace',
                slug: `personal-${authUser.id.substring(0, 8)}`,
                description: 'Your default personal workspace.',
                ownerId: authUser.id,
              }
            });
        }

        // Deep copy project
        const clonedProject = await prisma.project.create({
            data: {
                name: `${share.project.name} (Copy)`,
                description: share.project.description,
                deadline: share.project.deadline,
                ownerId: authUser.id,
                workspaceId: workspace.id,
                tasks: {
                    create: share.project.tasks.map(t => ({
                        title: t.title,
                        description: t.description,
                        status: t.status,
                        deadline: t.deadline,
                        order: t.order,
                        workspaceId: workspace!.id
                    }))
                }
            },
            include: { tasks: true }
        });

        return NextResponse.json({ success: true, data: clonedProject }, { status: 201 });

    } else if (share.itemType === 'NOTE' && share.note) {
        // Copy note
        const clonedNote = await prisma.note.create({
            data: {
                title: `${share.note.title} (Copy)`,
                content: share.note.content,
                audioUrl: share.note.audioUrl,
                transcript: share.note.transcript,
                summary: share.note.summary,
                meetingDate: share.note.meetingDate,
                authorId: authUser.id,
                // Do not attach to a project by default
            }
        });

        return NextResponse.json({ success: true, data: clonedNote }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Resource to copy not found or mismatched itemType' }, { status: 400 });

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Copy resource error', error);
    return NextResponse.json({ success: false, error: 'Failed to copy resource' }, { status: 500 });
  }
}
