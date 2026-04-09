
import { NextResponse } from 'next/server'
import { openrouter } from '@/lib/openrouter'

// Prevent Next.js from statically evaluating this route at build time.
// This route requires runtime env vars (OPENROUTER_API_KEY).
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { type, content, model = 'minimax/minimax-m2.5:free' } = await request.json()

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type and content' },
        { status: 400 }
      )
    }

    let messages = []
    let response_format = undefined

    switch (type) {
      case 'meeting-summary':
        messages = [
          {
            role: 'system' as const,
            content: 'You are an expert at summarizing meeting notes and extracting key points. Provide concise, actionable summaries with bullet points.',
          },
          {
            role: 'user' as const,
            content: `Please summarize this meeting transcript and extract the key points:\n\n${content}`,
          },
        ]
        break

      case 'flashcards':
        messages = [
          {
            role: 'system' as const,
            content: 'You are an expert educational AI. Generate flashcards based on the provided text using active recall principles. Return JSON format with "front" and "back" fields. DO NOT use markdown formatting like ```json. Return plain JSON only.',
          },
          {
            role: 'user' as const,
            content: `Generate 5-10 flashcards from this text:\n\n${content}`,
          },
        ]
        response_format = {
          type: 'json_schema' as const,
          json_schema: {
            name: 'flashcards',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                flashcards: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      front: { type: 'string' },
                      back: { type: 'string' },
                    },
                    required: ['front', 'back'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['flashcards'],
              additionalProperties: false,
            },
          },
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid AI type. Supported types: meeting-summary, flashcards' },
          { status: 400 }
        )
    }

    const response = await openrouter.chat.completions.create({
      model,
      messages,
      response_format,
      max_tokens: type === 'flashcards' ? 1000 : 800,
      temperature: type === 'flashcards' ? 0.7 : 0.3,
    })

    const result = response.choices[0]?.message?.content

    if (!result) {
      throw new Error('No content returned from AI')
    }

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}