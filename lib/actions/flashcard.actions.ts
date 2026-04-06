"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUser, authorizeDeckModify, authorizeNoteAccess } from '@/lib/auth-helpers'
import { createDeckSchema, createFlashcardSchema } from '@/lib/validations'
import { z } from 'zod'
import { type FlashcardDeck, type Flashcard, type PrismaFlashcardDeckResult, type PrismaFlashcardResult } from '@/lib/types'

// Helper function to transform Prisma FlashcardDeck to API response type
function toFlashcardDeckDTO(deck: PrismaFlashcardDeckResult): FlashcardDeck {
  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    authorId: deck.authorId,
    noteId: deck.noteId,
    author: deck.author,
    note: deck.note,
    cards: deck.cards?.map(toFlashcardDTO) ?? [],
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
  }
}

// Helper function to transform Prisma Flashcard to API response type
function toFlashcardDTO(card: PrismaFlashcardResult): Flashcard {
  return {
    id: card.id,
    front: card.front,
    back: card.back,
    nextReview: card.nextReview,
    interval: card.interval,
    easeFactor: card.easeFactor,
    repetitions: card.repetitions,
    deckId: card.deckId,
    deck: card.deck,
  }
}

export async function createDeck(
  title: string,
  description: string,
  noteId: string,
  authorId: string
): Promise<{ success: boolean; data?: FlashcardDeck; error?: string }> {
  try {
    const authUser = await requireUser()

    // Validate that the user is the author (or has note access)
    if (authUser.id !== authorId) {
      // If noteId is provided, verify user can access the note
      if (noteId) {
        await authorizeNoteAccess(noteId, authUser.id)
      } else {
        return { success: false, error: 'Unauthorized: Cannot create deck for another user' }
      }
    }

    // Validate input
    const validation = createDeckSchema.parse({
      title,
      description,
      noteId,
    })

    // Note validation: if noteId provided, ensure note exists
    if (validation.noteId) {
      const note = await prisma.note.findUnique({
        where: { id: validation.noteId },
      })
      if (!note) {
        return { success: false, error: 'Note not found' }
      }
    }

    const deck = await prisma.flashcardDeck.create({
      data: {
        title: validation.title,
        description: validation.description,
        noteId: validation.noteId,
        authorId: authUser.id, // Always use current user as author
      },
      include: {
        author: true,
        note: true,
        cards: true,
      },
    })

    if (validation.noteId) {
      revalidatePath(`/dashboard/notes/${validation.noteId}`)
    }
    revalidatePath('/dashboard')

    return { success: true, data: toFlashcardDeckDTO(deck) }
  } catch (error) {
    console.error('Create deck error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create flashcard deck' }
  }
}

export async function getNoteDecks(noteId: string): Promise<{ success: boolean; data?: FlashcardDeck[]; error?: string }> {
  try {
    const authUser = await requireUser()

    // Verify user can access the note
    await authorizeNoteAccess(noteId, authUser.id)

    const decks = await prisma.flashcardDeck.findMany({
      where: { noteId },
      include: {
        author: true,
        note: true,
        cards: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: decks.map(toFlashcardDeckDTO) }
  } catch (error) {
    console.error('Get note decks error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch flashcard decks' }
  }
}

export async function getUserDecks(userId: string): Promise<{ success: boolean; data?: FlashcardDeck[]; error?: string }> {
  try {
    const authUser = await requireUser()

    // Users can only see their own decks
    if (authUser.id !== userId) {
      return { success: false, error: 'Unauthorized: Can only view your own decks' }
    }

    const decks = await prisma.flashcardDeck.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        note: true,
        cards: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: decks.map(toFlashcardDeckDTO) }
  } catch (error) {
    console.error('Get user decks error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch flashcard decks' }
  }
}

export async function createFlashcard(
  deckId: string,
  front: string,
  back: string
): Promise<{ success: boolean; data?: Flashcard; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeDeckModify(deckId, authUser.id)

    // Validate input
    const validation = createFlashcardSchema.parse({
      front,
      back,
      deckId,
    })

    const card = await prisma.flashcard.create({
      data: {
        front: validation.front,
        back: validation.back,
        deckId: validation.deckId,
      },
      include: {
        deck: true,
      },
    })

    revalidatePath(`/dashboard/flashcards/${deckId}`)
    revalidatePath('/dashboard')

    return { success: true, data: toFlashcardDTO(card) }
  } catch (error) {
    console.error('Create flashcard error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create flashcard' }
  }
}

export async function updateCardSM2(
  cardId: string,
  quality: number
): Promise<{ success: boolean; data?: Flashcard; error?: string }> {
  try {
    const authUser = await requireUser()

    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: {
        deck: true,
      },
    })

    if (!card) {
      return { success: false, error: 'Flashcard not found' }
    }

    // Authorize - user must be the deck author
    if (card.deck.authorId !== authUser.id) {
      return { success: false, error: 'Unauthorized: Only the deck owner can update cards' }
    }

    // Validate quality (0-5 scale)
    if (quality < 0 || quality > 5 || !Number.isInteger(quality)) {
      return { success: false, error: 'Quality must be an integer between 0 and 5' }
    }

    // SM-2 Algorithm implementation
    let newInterval: number
    let newEaseFactor: number
    let newRepetitions: number

    if (quality < 3) {
      // Reset card
      newRepetitions = 0
      newInterval = 1
      newEaseFactor = card.easeFactor
    } else {
      if (card.repetitions === 0) {
        newInterval = 1
      } else if (card.repetitions === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(card.interval * card.easeFactor)
      }

      newRepetitions = card.repetitions + 1
      newEaseFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + newInterval)

    const updatedCard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: newRepetitions,
        nextReview,
      },
      include: {
        deck: true,
      },
    })

    revalidatePath(`/dashboard/flashcards/${card.deckId}`)
    revalidatePath('/dashboard')

    return { success: true, data: toFlashcardDTO(updatedCard) }
  } catch (error) {
    console.error('Update card SM2 error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update flashcard' }
  }
}

export async function getDeckById(id: string): Promise<{ success: boolean; data?: FlashcardDeck; error?: string }> {
  try {
    const authUser = await requireUser()

    const deck = await prisma.flashcardDeck.findUnique({
      where: { id },
      include: {
        author: true,
        note: true,
        cards: {
          orderBy: {
            nextReview: 'asc',
          },
        },
      },
    })

    if (!deck) {
      return { success: false, error: 'Flashcard deck not found' }
    }

    // Only the deck author can view the deck with cards
    if (deck.authorId !== authUser.id) {
      return { success: false, error: 'Unauthorized: Cannot access this deck' }
    }

    return { success: true, data: toFlashcardDeckDTO(deck) }
  } catch (error) {
    console.error('Get deck by ID error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch flashcard deck' }
  }
}

export async function getDueCards(userId: string): Promise<{ success: boolean; data?: Flashcard[]; error?: string }> {
  try {
    const authUser = await requireUser()

    // Users can only fetch their own due cards
    if (authUser.id !== userId) {
      return { success: false, error: 'Unauthorized: Can only fetch your own cards' }
    }

    const dueCards = await prisma.flashcard.findMany({
      where: {
        nextReview: {
          lte: new Date(),
        },
        deck: {
          authorId: userId,
        },
      },
      include: {
        deck: {
          include: {
            note: true,
          },
        },
      },
      orderBy: {
        nextReview: 'asc',
      },
    })

    return { success: true, data: dueCards.map(toFlashcardDTO) }
  } catch (error) {
    console.error('Get due cards error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to fetch due cards' }
  }
}

export async function deleteDeck(deckId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()
    await authorizeDeckModify(deckId, authUser.id)

    await prisma.flashcardDeck.delete({
      where: { id: deckId },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/flashcards')

    return { success: true }
  } catch (error) {
    console.error('Delete deck error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete deck' }
  }
}

export async function deleteFlashcard(cardId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireUser()

    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: { deck: true },
    })

    if (!card) {
      return { success: false, error: 'Flashcard not found' }
    }

    // Authorize - user must be the deck author
    if (card.deck.authorId !== authUser.id) {
      return { success: false, error: 'Unauthorized: Only the deck owner can delete cards' }
    }

    await prisma.flashcard.delete({
      where: { id: cardId },
    })

    revalidatePath(`/dashboard/flashcards/${card.deckId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Delete flashcard error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete flashcard' }
  }
}
