import { OpenAI } from 'openai'

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
    'X-Title': 'LockIn',
  },
})

export async function generateMeetingSummary(transcript: string): Promise<string> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'minimax/minimax-m2.5:free',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at summarizing meeting notes and extracting key points. Provide concise, actionable summaries with bullet points.',
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript and extract the key points:\n\n${transcript}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    })
    
    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Meeting summary generation error:', error)
    throw new Error('Failed to generate meeting summary')
  }
}

export async function generateFlashcards(text: string): Promise<Array<{ front: string; back: string }>> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'minimax/minimax-m2.5:free',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational AI. Generate flashcards based on the provided text using active recall principles. Return JSON format with "front" and "back" fields. DO NOT use markdown formatting like ```json. Return plain JSON only.',
        },
        {
          role: 'user',
          content: `Generate 5-10 flashcards from this text:\n\n${text}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'flashcards',
          schema: {
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
      },
      max_tokens: 1000,
      temperature: 0.7,
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content returned from AI')
    }
    
    // Parse the JSON response
    const flashcards = JSON.parse(content)
    
    // Validate the structure
    if (!Array.isArray(flashcards)) {
      throw new Error('Invalid flashcard format returned')
    }
    
    return flashcards
  } catch (error) {
    console.error('Flashcard generation error:', error)
    throw new Error('Failed to generate flashcards')
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' })
    const file = new File([blob], 'audio.webm', { type: 'audio/webm' })
    
    const response = await openrouter.audio.transcriptions.create({
      model: 'google/gemini-2.5-flash-lite',
      file,
      response_format: 'verbose_json',
    })
    
    return response.text
  } catch (error) {
    console.error('Audio transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}