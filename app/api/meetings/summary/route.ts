import { NextResponse } from 'next/server'
import { generateMeetingIntelligence } from '@/lib/ai/ai-engine'

export async function POST(req: Request) {
  try {
    const { transcript, workspaceSlug } = await req.json()

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
    }

    const intelligence = await generateMeetingIntelligence(transcript, `Workspace: ${workspaceSlug || 'Default'}`)

    return NextResponse.json(intelligence)
  } catch (error) {
    console.error('Meeting AI API error:', error)
    return NextResponse.json({ error: 'Failed to process meeting intelligence' }, { status: 500 })
  }
}
