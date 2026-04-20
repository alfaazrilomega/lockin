"use client"

import { useState, useMemo, useRef, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Music, 
  BrainCircuit, 
  Sparkles, 
  ArrowLeft,
  Mic,
  Square,
  Plus,
  RotateCcw,
  BookOpen,
  Loader2,
  CheckCheck,
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { type Note, type FlashcardDeck } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast" 
import { FlashcardReviewModal } from "./flashcard-review-modal"
interface NoteDetailsClientProps {
  note: Note
}

export function NoteDetailsClient({ note: initialNote }: NoteDetailsClientProps) {
  const [note, setNote] = useState(initialNote)
  const [editableContent, setEditableContent] = useState(initialNote.content ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isGeneratingCards, setIsGeneratingCards] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const { toast } = useToast()

  const handleSaveContent = useCallback(async (contentToSave: string) => {
    if (contentToSave === note.content) return // no change
    setIsSaving(true)
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSave }),
      })
      const result = await res.json()
      if (result.success) {
        setNote(result.data)
        setSavedIndicator(true)
        setTimeout(() => setSavedIndicator(false), 2000)
      }
    } catch (err) {
      console.error("Auto-save failed:", err)
    } finally {
      setIsSaving(false)
    }
  }, [note.id, note.content])

  const aiSource = note.transcript ? "Transcript" : editableContent ? "Content" : "None"

  // Stable waveform bar heights — computed once on mount.
  const waveBarHeights = useMemo(
    () => Array.from({ length: 20 }, () => 20 + Math.floor(Math.random() * 80)),
    []
  )

  const handleGenerateSummary = async () => {
    if (!note.transcript && !note.content) {
      toast({
        title: "No content",
        description: "No transcript or content available to summarize.",
        variant: "destructive",
      })
      return
    }

    setIsSummarizing(true)
    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId: note.id }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setNote(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate summary",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  // --- Audio Recording Handlers ---

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true)
    try {
      const mimeType = blob.type || "audio/webm"
      const extension = mimeType.includes("mp4") || mimeType.includes("m4a") ? "m4a" : "webm"
      const audioFile = new File([blob], `audio.${extension}`, { type: mimeType })

      const formData = new FormData()
      formData.append("audio", audioFile)
      formData.append("noteId", note.id)

      const response = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success && result.transcript) {
        setNote(prev => ({ ...prev, transcript: result.transcript }))
        toast({
          title: "Transcription complete!",
          description: "Your audio has been transcribed successfully.",
        })
      } else {
        toast({
          title: "Transcription failed",
          description: result.error || "Could not transcribe audio.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during transcription.",
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleStartRecording = async () => {
    try {
      // Request screen share — browsers require { video: true } to offer audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      // Kill video tracks immediately — we only want audio to save memory
      displayStream.getVideoTracks().forEach(t => t.stop())

      // Verify the user checked "Share tab audio"
      const audioTracks = displayStream.getAudioTracks()
      if (audioTracks.length === 0) {
        displayStream.getTracks().forEach(t => t.stop())
        toast({
          title: "No audio captured",
          description: "Please check the \"Share tab audio\" box in the browser prompt before clicking Share.",
          variant: "destructive",
        })
        return
      }

      // Build an audio-only MediaStream from the tab's audio track
      const audioOnlyStream = new MediaStream(audioTracks)
      streamRef.current = audioOnlyStream
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(audioOnlyStream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm"
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setLastAudioBlob(blob)
        // Release all tracks
        streamRef.current?.getTracks().forEach(t => t.stop())
        handleTranscribe(blob)
      }

      // Handle user stopping share from the browser's native share bar
      audioTracks[0].onended = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          handleStopRecording()
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err: unknown) {
      // User hit "Cancel" on the screen-share prompt
      if (err instanceof Error && err.name === "NotAllowedError") {
        toast({
          title: "Screen share cancelled",
          description: "Select a tab and check \"Share tab audio\" to capture meeting audio.",
        })
        return
      }
      toast({
        title: "Could not start capture",
        description: "Your browser may not support tab audio capture.",
        variant: "destructive",
      })
    }
  }

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording()
    } else {
      handleStartRecording()
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!note.transcript && !note.content) {
      toast({
        title: "No content",
        description: "No transcript or content available to generate flashcards.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingCards(true)
    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId: note.id }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setNote(prev => ({
          ...prev,
          flashcardDecks: [...(prev.flashcardDecks || []), result.data]
        }))
        toast({
          title: "Success",
          description: "Flashcard deck generated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate flashcards",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingCards(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Flashcard Review Modal */}
      <FlashcardReviewModal 
        key={selectedDeck?.id + (isReviewModalOpen ? '-open' : '-closed')}
        deck={selectedDeck}
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
      />

      {/* Navigation & Header */}
      <div className="flex flex-col space-y-4">
        <Link 
          href="/dashboard/notes" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Link>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
               <h1 className="text-4xl font-bold tracking-tight text-foreground font-satoshi">
                {note.title}
              </h1>
              {note.project && (
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                  {note.project.name}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Captured on {formatDate(note.createdAt)} • {note.author?.name ?? 'Unknown author'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => lastAudioBlob && handleTranscribe(lastAudioBlob)}
              disabled={!lastAudioBlob || isTranscribing}
            >
              {isTranscribing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              {isTranscribing ? "Transcribing..." : "Retranscribe"}
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={handleGenerateSummary}
              disabled={isSummarizing || aiSource === "None"}
            >
              {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isSummarizing ? "Processing..." : `Summarize ${aiSource}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Media & Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-muted/10 border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center">
                  <Music className="mr-2 h-4 w-4 text-primary" />
                  Tab / Meeting Audio Capture
                </CardTitle>
                <Badge variant="info">{isRecording ? "Recording" : note.transcript ? "Transcribed" : "Ready to Capture"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Waveform / Recording Indicator */}
                <div className="flex items-end justify-center space-x-1 h-12 w-full max-w-sm">
                  {waveBarHeights.map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-t-full transition-all duration-300 ${
                        isRecording
                          ? 'bg-red-500 animate-pulse'
                          : isTranscribing
                          ? 'bg-primary animate-pulse'
                          : 'bg-primary/40'
                      }`}
                      style={{ height: isRecording ? `${20 + Math.floor(Math.random() * 80)}%` : `${h}%` }}
                    />
                  ))}
                </div>

                {/* Status Text */}
                <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                  {isTranscribing
                    ? 'Transcribing with Groq Whisper...'
                    : isRecording
                    ? 'Capturing tab audio — click to stop'
                    : lastAudioBlob
                    ? 'Capture complete — transcription saved'
                    : 'Click to capture tab / meeting audio'}
                </p>

                {/* Controls */}
                <div className="flex items-center space-x-6">
                  <Button
                    size="icon"
                    variant="outline"
                    className={`h-16 w-16 rounded-full border-2 shadow-lg transition-all duration-300 ${
                      isRecording
                        ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20 shadow-red-500/20 scale-110'
                        : 'shadow-primary/20 hover:shadow-primary/30'
                    }`}
                    onClick={handleToggleRecording}
                    disabled={isTranscribing}
                  >
                    {isRecording ? (
                      <Square className="h-7 w-7 fill-red-500 text-red-500" />
                    ) : isTranscribing ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : (
                      <Mic className="h-7 w-7" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-12 mb-6">
              <TabsTrigger value="summary" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-6">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Summary
              </TabsTrigger>
              <TabsTrigger value="transcript" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-6">
                <FileText className="mr-2 h-4 w-4" />
                Full Transcript
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-6">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Flashcards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="animate-in fade-in duration-300">
               <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
                  <h3 className="text-xl font-bold font-satoshi mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    Key Takeaways
                  </h3>
                  <div className="space-y-4 text-foreground/80 leading-relaxed italic whitespace-pre-wrap">
                    {note.summary || "No summary generated yet. Click 'AI Insight' to analyze this note."}
                  </div>
                </div>
            </TabsContent>

            <TabsContent value="transcript" className="animate-in fade-in duration-300">
              <div className="bg-background border border-border rounded-xl p-6 font-mono text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {note.transcript || "No transcript available. Use the recorder to capture audio first."}
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="animate-in fade-in duration-300 space-y-6">
              {(note.flashcardDecks?.length ?? 0) === 0 ? (
                <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border group">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">Generate Study Material</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                    Transform this note into a deck of smart flashcards using AI.
                  </p>
                  <Button 
                    className="mt-8"
                    onClick={handleGenerateFlashcards}
                    disabled={isGeneratingCards || aiSource === "None"}
                  >
                    {isGeneratingCards ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isGeneratingCards ? "Generating..." : `Generate from ${aiSource}`}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {(note.flashcardDecks ?? []).map((deck) => (
                    <Card 
                      key={deck.id} 
                      className="hover:border-primary transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedDeck(deck as FlashcardDeck);
                        setIsReviewModalOpen(true);
                      }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{deck.title}</CardTitle>
                          <CardDescription>{(deck.cards?.length ?? 0)} cards in this deck</CardDescription>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="group-hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeck(deck as FlashcardDeck);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          <BookOpen className="h-5 w-5" />
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="bg-background border-border shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Note Content</CardTitle>
              {savedIndicator && (
                <span className="flex items-center gap-1 text-xs text-green-500 animate-in fade-in">
                  <CheckCheck className="h-3 w-3" />
                  Saved
                </span>
              )}
              {isSaving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                onBlur={() => handleSaveContent(editableContent)}
                placeholder="Start writing your note here..."
                className="min-h-[200px] text-sm leading-relaxed resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent text-foreground/80"
              />
            </CardContent>
          </Card>

          <Card className="bg-background border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Meeting Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-4">
                <span className="font-semibold">Insights level</span>
                <Badge variant="info">Detailed</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
