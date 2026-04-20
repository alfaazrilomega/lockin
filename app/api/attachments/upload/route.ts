import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const noteId = formData.get('noteId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Generate secure storage path: userId/timestamp_filename
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filePath = `${authUser.id}/${timestamp}_${safeFilename}`;

    // 2. Upload to Supabase Storage (Assumes 'attachments' bucket exists)
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError);
      return NextResponse.json({ success: false, error: 'Failed to upload to storage' }, { status: 500 });
    }

    // 3. Get Public URL (if the bucket is public, else it requires signed URLs later)
    const { data: publicUrlData } = supabase
      .storage
      .from('attachments')
      .getPublicUrl(filePath);

    // 4. Create Database Mapping with PENDING status (Step 1 of Architecture)
    const attachment = await prisma.attachment.create({
      data: {
        uploaderId: authUser.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageUrl: uploadData.path,
        publicUrl: publicUrlData?.publicUrl || null,
        processingStatus: 'PENDING',
        noteId: noteId || null
      }
    });

    // 5. Instantly return to unblock the UI. UI will then ping `/api/attachments/process`
    return NextResponse.json({ success: true, data: attachment }, { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Upload attachment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to ingest file' }, { status: 500 });
  }
}
