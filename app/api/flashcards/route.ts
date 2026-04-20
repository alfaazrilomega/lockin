import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"

export async function GET() {
  try {
    const authUser = await requireUser()

    const decks = await prisma.flashcardDeck.findMany({
      where: { authorId: authUser.id },
      include: {
        cards: {
          select: {
            id: true,
            front: true,
            back: true,
            nextReview: true,
            interval: true,
            easeFactor: true,
            repetitions: true,
            deckId: true,
          }
        },
        note: {
          select: { id: true, title: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: decks })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    console.error("Flashcard decks fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch flashcard decks" }, { status: 500 })
  }
}
