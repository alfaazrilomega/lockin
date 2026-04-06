"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  CheckCircle2,
  BrainCircuit
} from "lucide-react"
import { type FlashcardDeck } from "@/lib/types"

interface FlashcardReviewModalProps {
  deck: FlashcardDeck | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function FlashcardReviewModal({ deck, isOpen, onOpenChange }: FlashcardReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const cards = deck?.cards ?? []
  const currentCard = cards[currentIndex]
  const isLastCard = currentIndex === cards.length - 1
  const isFirstCard = currentIndex === 0

  // Reset state when modal opens/changes deck


  const handleNext = () => {
    if (!isLastCard) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (!isFirstCard) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  if (!deck || cards.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              <BrainCircuit className="mr-1 h-3 w-3" />
              Card {currentIndex + 1} of {cards.length}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {deck.title}
            </span>
          </div>
          <DialogTitle className="sr-only font-satoshi">Review Flashcards</DialogTitle>
          <DialogDescription className="sr-only">
            Study cards from {deck.title}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-10 flex flex-col items-center justify-center min-h-[300px]">
          {/* Card Container with 3D animation feel */}
          <div 
            className="relative w-full h-64 cursor-pointer perspective-1000 group"
            onClick={toggleFlip}
          >
            <div className={`relative w-full h-full text-center transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front side */}
              <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center bg-muted/20 border-2 border-primary/10 rounded-2xl p-8 shadow-sm group-hover:border-primary/30 transition-colors">
                <p className="text-xl font-semibold leading-relaxed font-satoshi text-foreground">
                  {currentCard.front}
                </p>
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground flex items-center">
                  <RotateCw className="mr-1 h-3 w-3" />
                  Click to see answer
                </div>
              </div>

              {/* Back side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 shadow-md">
                <div className="space-y-4 text-center">
                  <p className="text-sm uppercase tracking-widest text-primary font-bold">Answer</p>
                  <p className="text-xl font-medium leading-relaxed font-satoshi text-foreground">
                    {currentCard.back}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-primary/60 flex items-center">
                   <CheckCircle2 className="mr-1 h-3 w-3" />
                   Got it?
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogHeader className="p-6 pt-0 border-t border-border/50 bg-muted/10">
          <div className="flex items-center justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrevious}
              disabled={isFirstCard}
              className="h-10 px-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {cards.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-4' : 'bg-muted-foreground/30'}`}
                />
              ))}
            </div>

            <Button 
              variant={isLastCard ? "default" : "outline"}
              size="sm"
              onClick={isLastCard ? () => onOpenChange(false) : handleNext}
              className={`h-10 px-4 ${isLastCard ? 'bg-primary shadow-lg shadow-primary/20' : ''}`}
            >
              {isLastCard ? "Finish" : "Next"}
              {!isLastCard && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
