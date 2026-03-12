import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Music, Quote } from "lucide-react"
import { type Note } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/dashboard/notes/${note.id}`}>
      <Card className="group bg-background border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
          {note.audioUrl ? <Music className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold font-satoshi group-hover:text-primary transition-colors pr-8">
              {note.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {note.project && (
              <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 border-primary/20 text-primary bg-primary/5">
                {note.project.name}
              </Badge>
            )}
            <div className="flex items-center text-[10px] text-muted-foreground font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {note.meetingDate ? formatDate(note.meetingDate) : formatDate(note.createdAt)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px] leading-relaxed italic">
            {note.summary || note.content || "No content or transcription available yet..."}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex space-x-2">
              {note.transcript && (
                <div className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Quote className="h-3 w-3" />
                </div>
              )}
              {(note.flashcardDecks?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="text-[10px] scale-90 py-0 h-4">
                  {note.flashcardDecks!.length} Decks
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
              OPEN NOTE →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
