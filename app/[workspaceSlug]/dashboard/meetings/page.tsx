import MeetingNotepadUI from '@/components/meetings/meeting-notepad-ui'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Meeting Notepad | LockIn Workspace',
  description: 'Verbatim-first AI Meeting Notepad with Deepgram Nova-3 STT & Gemini 3.6 Flash Fallback Chain.',
}

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>
}) {
  const { workspaceSlug } = await params

  return <MeetingNotepadUI workspaceSlug={workspaceSlug} />
}
