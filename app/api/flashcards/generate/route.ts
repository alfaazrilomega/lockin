import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeNoteAccess } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const { noteId } = await request.json();

    if (!noteId) {
      return NextResponse.json({ success: false, error: 'Missing noteId in request body' }, { status: 400 });
    }

    const authUser = await requireUser();
    // Verify user has permission to access this note.
    await authorizeNoteAccess(noteId, authUser.id);

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    const textToProcess = note.transcript || note.content;
    const sourceType = note.transcript ? "audio transcript" : "written note";

    if (!textToProcess) {
      return NextResponse.json({ success: false, error: 'No transcript or content available to generate flashcards' }, { status: 400 });
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
        model: "minimax/minimax-m2.5:free",
        messages: [
          { 
            role: "system", 
            content: `You are an expert study aid generator. Create high-yield flashcards from the provided ${sourceType}. You MUST respond ONLY with a valid JSON array of objects. Do not include markdown formatting like \`\`\`json. Each object must have a 'front' (the question/concept) and a 'back' (the answer/definition). Example: [{"front": "Question?", "back": "Answer!"}].` 
          },
          { 
            role: "user", 
            content: textToProcess 
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
    let generatedText = data.choices[0].message.content;

    // Robust JSON Handling: Strip markdown code blocks if they exist
    generatedText = generatedText.replace(/```json\n?|```/g, "").trim();

    let cards;
    try {
      cards = JSON.parse(generatedText);
      if (!Array.isArray(cards)) {
        throw new Error("AI response is not an array");
      }
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", generatedText, parseError);
      return NextResponse.json({ success: false, error: 'AI returned invalid data format' }, { status: 500 });
    }

    // Create the deck and cards in a transaction
    const newDeck = await prisma.flashcardDeck.create({
      data: {
        title: `Deck for: ${note.title}`,
        noteId: noteId,
        authorId: authUser.id,
        cards: {
          create: cards.map((card: { front: string; back: string }) => ({
            front: card.front,
            back: card.back,
            nextReview: new Date(),
          }))
        }
      },
      include: {
        cards: true,
      }
    });

    return NextResponse.json({ success: true, data: newDeck });
  } catch (error) {
    console.error("Generate flashcards API error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
