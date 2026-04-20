"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { type FlashcardDeck } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Loader2, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { FlashcardReviewModal } from "@/components/notes/flashcard-review-modal"
import { Skeleton } from "@/components/ui/skeleton"

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await axios.get("/api/flashcards", { withCredentials: true })
        if (res.data.success) setDecks(res.data.data)
      } catch (err) {
        console.error("Failed to fetch flashcard decks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDecks()
  }, [])

  const handleReviewDeck = (deck: FlashcardDeck) => {
    setSelectedDeck(deck)
    setIsReviewOpen(true)
  }

  // Group decks: due for review vs not
  const now = new Date()
  const dueDecks = decks.filter(d =>
    d.cards?.some(c => new Date(c.nextReview) <= now)
  )
  const upcomingDecks = decks.filter(d =>
    !d.cards?.some(c => new Date(c.nextReview) <= now)
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <FlashcardReviewModal
        deck={selectedDeck}
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Flashcards
          </h1>
          <p className="text-muted-foreground text-sm">
            Review your AI-generated study decks using spaced repetition.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/notes">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate from Note
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="border border-border rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <Skeleton className="h-5 w-48" />
                       <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-border rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <Skeleton className="h-5 w-48" />
                       <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No flashcard decks yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Generate flashcards from your meeting notes using the AI button inside any note.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/notes">Browse Notes</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {dueDecks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Due for Review
                </h2>
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">
                  {dueDecks.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dueDecks.map(deck => {
                  const dueCount = deck.cards?.filter(c => new Date(c.nextReview) <= now).length ?? 0
                  return (
                    <Card
                      key={deck.id}
                      className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-all cursor-pointer group"
                      onClick={() => handleReviewDeck(deck)}
                    >
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-base group-hover:text-red-500 transition-colors">{deck.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {deck.cards?.length ?? 0} total cards · {dueCount} due
                          </CardDescription>
                        </div>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white shrink-0">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {upcomingDecks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                All Decks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingDecks.map(deck => (
                  <Card
                    key={deck.id}
                    className="border-border hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => handleReviewDeck(deck)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">{deck.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {deck.cards?.length ?? 0} cards · {deck.note ? `From: ${deck.note.title}` : 'Standalone deck'}
                        </CardDescription>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0 group-hover:text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
