import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { updateShareSchema } from '@/lib/validations';
import { z } from 'zod';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: shareId } = await params;
    const authUser = await requireUser();
    const body = await request.json();
    const validation = updateShareSchema.parse(body);

    const share = await prisma.sharedResource.findUnique({
      where: { id: shareId },
      include: {
        project: true,
        note: true,
      }
    });

    if (!share) {
      return NextResponse.json({ success: false, error: 'Share request not found' }, { status: 404 });
    }

    const { action } = validation;

    if (action === 'CANCEL') {
      if (share.senderId !== authUser.id) {
        return NextResponse.json({ success: false, error: 'Forbidden. Only the sender can cancel.' }, { status: 403 });
      }
      
      const updated = await prisma.sharedResource.update({
        where: { id: shareId },
        data: { status: 'CANCELLED' }
      });
      return NextResponse.json({ success: true, data: updated });
    } 
    
    if (action === 'ACCEPT' || action === 'REJECT') {
      if (share.receiverId !== authUser.id) {
         return NextResponse.json({ success: false, error: 'Forbidden. Only the receiver can accept or reject.' }, { status: 403 });
      }
      
      const updated = await prisma.sharedResource.update({
        where: { id: shareId },
        data: { status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' }
      });
      
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    console.error('Update share error', error);
    return NextResponse.json({ success: false, error: 'Failed to update share request' }, { status: 500 });
  }
}
