"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { type FlashcardDeck, type Flashcard } from '@/lib/types'

export async function createDeck(
  title: string,
  description: string,
  noteId: string,
  authorId: string
): Promise<{ success: boolean; data?: FlashcardDeck; error?: string }> {
  try {
    const deck = await prisma.flashcardDeck.create({
      data: {
        title,
        description,
        noteId,
        authorId,
      },
      include: {
        author: true,
        note: true,
        cards: true,
      },
    })

    revalidatePath(`/dashboard/notes/${noteId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: deck }
  } catch (error) {
    console.error('Create deck error:', error)
    return { success: false, error: 'Failed to create flashcard deck' }
  }
}

export async function getNoteDecks(noteId: string): Promise<{ success: boolean; data?: FlashcardDeck[]; error?: string }> {
  try {
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

    return { success: true, data: decks }
  } catch (error) {
    console.error('Get note decks error:', error)
    return { success: false, error: 'Failed to fetch flashcard decks' }
  }
}

export async function createFlashcard(
  deckId: string,
  front: string,
  back: string
): Promise<{ success: boolean; data?: Flashcard; error?: string }> {
  try {
    const card = await prisma.flashcard.create({
      data: {
        front,
        back,
        deckId,
      },
      include: {
        deck: true,
      },
    })

    revalidatePath(`/dashboard/flashcards/${deckId}`)
    revalidatePath('/dashboard')
    
    return { success: true, data: card }
  } catch (error) {
    console.error('Create flashcard error:', error)
    return { success: false, error: 'Failed to create flashcard' }
  }
}

export async function updateCardSM2(
  cardId: string,
  quality: number
): Promise<{ success: boolean; data?: Flashcard; error?: string }> {
  try {
    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: {
        deck: true,
      },
    })

    if (!card) {
      return { success: false, error: 'Flashcard not found' }
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
    
    return { success: true, data: updatedCard }
  } catch (error) {
    console.error('Update card SM2 error:', error)
    return { success: false, error: 'Failed to update flashcard' }
  }
}

export async function getDeckById(id: string): Promise<{ success: boolean; data?: FlashcardDeck; error?: string }> {
  try {
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

    return { success: true, data: deck }
  } catch (error) {
    console.error('Get deck by ID error:', error)
    return { success: false, error: 'Failed to fetch flashcard deck' }
  }
}

export async function getDueCards(userId: string): Promise<{ success: boolean; data?: Flashcard[]; error?: string }> {
  try {
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

    return { success: true, data: dueCards }
  } catch (error) {
    console.error('Get due cards error:', error)
    return { success: false, error: 'Failed to fetch due cards' }
  }
}