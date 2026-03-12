"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Music, 
  BrainCircuit, 
  Sparkles, 
  ArrowLeft,
  Mic,
  Play,
  Plus,
  RotateCcw,
  BookOpen,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { generateSummary, generateFlashcards } from "@/lib/actions/ai.actions"
import { type Note } from "@/lib/types"
// import { toast } from "sonner" 

interface NoteDetailsClientProps {
  note: Note
}

export function NoteDetailsClient({ note: initialNote }: NoteDetailsClientProps) {
  const [note, setNote] = useState(initialNote)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isGeneratingCards, setIsGeneratingCards] = useState(false)

  // Stable waveform bar heights — computed once on mount.
  // Inline Math.random() during render causes hydration mismatches because
  // the server and client generate different values on each call.
  const waveBarHeights = useMemo(
    () => Array.from({ length: 20 }, () => 20 + Math.floor(Math.random() * 80)),
    []
  )

  const handleGenerateSummary = async () => {
    if (!note.transcript) {
      alert("No transcript available to summarize.")
      return
    }

    setIsSummarizing(true)
    try {
      const result = await generateSummary(note.id, note.transcript)
      if (result.success && result.data) {
        setNote({ ...note, summary: result.data })
      } else {
        alert(result.error || "Failed to generate summary")
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred")
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!note.transcript) {
      alert("No transcript available to generate flashcards.")
      return
    }

    setIsGeneratingCards(true)
    try {
      const result = await generateFlashcards(note.id, note.transcript, note.title)
      if (result.success && result.data) {
        // Refresh the page or update state to show the new deck
        window.location.reload()
      } else {
        alert(result.error || "Failed to generate flashcards")
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred")
    } finally {
      setIsGeneratingCards(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retranscribe
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={handleGenerateSummary}
              disabled={isSummarizing || !note.transcript}
            >
              {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isSummarizing ? "Processing..." : "AI Insight"}
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
                  Voice Note Recording
                </CardTitle>
                <Badge variant="info">{note.audioUrl ? "Media Loaded" : "Ready to Process"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="flex items-end justify-center space-x-1 h-12 w-full max-w-sm">
                  {waveBarHeights.map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 bg-primary/40 rounded-t-full transition-all duration-300 ${isSummarizing ? 'animate-pulse' : ''}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-6">
                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-full border-2">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-16 w-16 rounded-full shadow-lg shadow-primary/20 scale-110">
                    <Play className="h-8 w-8 fill-current" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-full border-2">
                    <Mic className="h-5 w-5" />
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
                    disabled={isGeneratingCards || !note.transcript}
                  >
                    {isGeneratingCards ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isGeneratingCards ? "Generating..." : "Generate Deck"}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {(note.flashcardDecks ?? []).map((deck) => (
                    <Card key={deck.id} className="hover:border-primary transition-colors cursor-pointer group">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{deck.title}</CardTitle>
                          <CardDescription>{(deck.cards?.length ?? 0)} cards in this deck</CardDescription>
                        </div>
                        <Button size="icon" variant="ghost" className="group-hover:text-primary">
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Original Content</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-foreground/80 leading-relaxed">
                {note.content || "No manual content added."}
              </p>
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
