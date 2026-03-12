"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { type AISummaryRequest, type FlashcardGenerationResult } from '@/lib/types'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const MODEL = "google/gemini-2.0-flash-001"

async function callOpenRouter(prompt: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY")
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://lockin-workspace.vercel.app", // Optional
      "X-Title": "LockIn Workspace", // Optional
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert productivity assistant for the LockIn workspace. Your goal is to help users organize their hectic lives through clear summaries and effective study materials." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("OpenRouter API error:", errorData)
    throw new Error("Failed to communicate with AI service")
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function generateSummary(noteId: string, transcript: string) {
  try {
    const prompt = `Please provide a concise, professional summary of the following transcript. 
    Focus on key decisions, action items, and main topics. 
    Use a friendly but professional tone.
    Output the summary in Markdown format with headers and bullet points.
    
    Transcript:
    ${transcript}`

    const summary = await callOpenRouter(prompt)

    await prisma.note.update({
      where: { id: noteId },
      data: { summary },
    })

    revalidatePath(`/dashboard/notes/${noteId}`)
    return { success: true, data: summary }
  } catch (error) {
    console.error("Generate summary error:", error)
    return { success: false, error: "Failed to generate summary" }
  }
}

export async function generateFlashcards(noteId: string, transcript: string, title: string) {
  try {
    const prompt = `Based on the following transcript, generate a list of 5-10 flashcards for studying.
    Each flashcard should have a 'front' (question or concept) and a 'back' (answer or definition).
    Output the result as a raw JSON array of objects with 'front' and 'back' keys.
    Do NOT include any markdown formatting, just the raw JSON.
    
    Transcript:
    ${transcript}`

    const resultText = await callOpenRouter(prompt)
    // Clean up potential markdown blocks if AI ignored instructions
    const jsonText = resultText.replace(/```json|```/g, "").trim()
    const cards: FlashcardGenerationResult[] = JSON.parse(jsonText)

    const deck = await prisma.flashcardDeck.create({
      data: {
        title: `Study Deck: ${title}`,
        noteId: noteId,
        authorId: (await prisma.note.findUnique({ where: { id: noteId }, select: { authorId: true } }))?.authorId || "",
        cards: {
          create: cards.map(card => ({
            front: card.front,
            back: card.back,
            nextReview: new Date(),
          }))
        }
      },
    })

    revalidatePath(`/dashboard/notes/${noteId}`)
    return { success: true, data: deck }
  } catch (error) {
    console.error("Generate flashcards error:", error)
    return { success: false, error: "Failed to generate flashcards" }
  }
}
