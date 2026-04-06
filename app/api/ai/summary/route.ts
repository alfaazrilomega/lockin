import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeNoteModify } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const { noteId } = await request.json();

    if (!noteId) {
      return NextResponse.json({ success: false, error: 'Missing noteId in request body' }, { status: 400 });
    }

    const authUser = await requireUser();
    // Verify user has permission to modify this note.
    await authorizeNoteModify(noteId, authUser.id);

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    const textToSummarize = note.transcript || note.content;
    const sourceType = note.transcript ? "audio transcript" : "written note";

    if (!textToSummarize) {
      return NextResponse.json({ success: false, error: 'No transcript or content available to summarize' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { 
            role: "system", 
            content: `You are an expert technical summarizer. Extract the core insights, action items, and key decisions from the provided ${sourceType}. Format cleanly with bullet points.` 
          },
          { 
            role: "user", 
            content: textToSummarize 
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json({ success: false, error: 'Failed to communicate with AI service' }, { status: 502 });
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { summary: generatedText },
    });

    return NextResponse.json({ success: true, data: updatedNote });
  } catch (error) {
    console.error("Generate summary API error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
