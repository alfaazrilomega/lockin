import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser, authorizeNoteAccess } from "@/lib/auth-helpers"

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user session
    const authUser = await requireUser()

    // 2. Parse FormData
    const formData = await request.formData()
    const audio = formData.get("audio") as File | null
    const noteId = formData.get("noteId") as string | null

    if (!audio || !noteId) {
      return NextResponse.json(
        { success: false, error: "Missing audio file or noteId" },
        { status: 400 }
      )
    }

    // 3. Authorize note access
    await authorizeNoteAccess(noteId, authUser.id)

    // 4. Determine correct file extension for Groq (Safari records mp4, others webm)
    const mimeType = audio.type || "audio/webm"
    const extension = mimeType.includes("mp4") || mimeType.includes("m4a")
      ? "m4a"
      : "webm"
    const fileName = `audio.${extension}`

    // 5. Build FormData for Groq Whisper API
    const groqFormData = new FormData()
    groqFormData.append("file", new File([audio], fileName, { type: mimeType }))
    groqFormData.append("model", "whisper-large-v3")
    groqFormData.append("response_format", "text")
    groqFormData.append("temperature", "0") // Prevents hallucinations on silent/music sections

    // 6. Call Groq Whisper API (do NOT set Content-Type — browser sets multipart boundary)
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqFormData,
      }
    )

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error("Groq API error:", errorText)
      return NextResponse.json(
        { success: false, error: `Groq transcription failed: ${groqResponse.status}` },
        { status: 502 }
      )
    }

    // Groq returns plain text when response_format is "text"
    const transcript = (await groqResponse.text()).trim()

    // 7. Update Note in database
    await prisma.note.update({
      where: { id: noteId },
      data: { transcript },
    })

    return NextResponse.json({ success: true, transcript })
  } catch (error) {
    console.error("Transcription error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
