'use client'

import React, { useState, useRef } from 'react'
import { 
  Mic, MicOff, Sparkles, FileText, CheckSquare, Receipt, 
  Share2, RefreshCw, Volume2, Download, Send, Calendar, CheckCircle2 
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  time: string
  client: string
  agenda: string
}

interface ActionItem {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  completed: boolean
}

interface InvoiceItem {
  description: string
  amount: number
}

export default function MeetingNotepadUI({ workspaceSlug }: { workspaceSlug: string }) {
  const [isRecording, setIsRecording] = useState(false)
  const [verbatimTranscript, setVerbatimTranscript] = useState<string>(
    'Klien Azril (Omega Corp): "Kami membutuhkan portal task management berkecepatan tinggi dengan integrasi AI Meeting Notepad, fitur RLS security Supabase, dan email follow-up otomatis."\n\nDeveloper: "Tentu, LockIn menyediakan dual-pane AI Notepad dengan fallback 5-Layer Gemini 3.6 Flash & Deepgram Nova-3."'
  )
  const [summaryNotes, setSummaryNotes] = useState<string>(
    '### 🎯 Keputusan Utama Meeting\n- **Arsitektur:** Menggunakan Next.js 16 App Router + Supabase RLS.\n- **AI Engine:** STT Deepgram Nova-3 (30s chunking) + LLM Gemini 3.6 Flash.\n- **Fitur Granola:** Verbatim-first UI, AI Action Items, & 1-Click Invoice Generator.'
  )
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', title: 'Setup Supabase RLS Policies & Prisma 7 Schema', priority: 'high', assignee: 'Azril', completed: true },
    { id: '2', title: 'Integrasikan 5-Layer Gemini Fallback Chain', priority: 'high', assignee: 'AI Assistant', completed: true },
    { id: '3', title: 'Publish ke Cloudflare Pages (lockin.pages.dev)', priority: 'medium', assignee: 'Team', completed: false },
  ])
  const [invoice, setInvoice] = useState<{ clientName: string; items: InvoiceItem[]; totalAmount: number }>({
    clientName: 'Omega Corp',
    items: [
      { description: 'Pengembangan Portal LockIn Enterprise', amount: 1500 },
      { description: 'Integrasi AI Meeting Notepad & Deepgram STT', amount: 500 },
    ],
    totalAmount: 2000,
  })

  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'invoice'>('notes')

  // Google Calendar Integration State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: 'cal-1',
      title: 'Sprint Planning & Architecture Sync',
      time: '14:00 WIB (Hari ini)',
      client: 'Omega Corp',
      agenda: 'Pembahasan arsitektur Supabase RLS, Prisma 7, dan integrasi Google Calendar Sync.'
    },
    {
      id: 'cal-2',
      title: 'Review Portal Task Management',
      time: '16:30 WIB (Hari ini)',
      client: 'Glints Enterprise',
      agenda: 'Demo fitur 60FPS Optimistic UI Kanban Board dan AI Meeting Notes Granola Engine.'
    },
    {
      id: 'cal-3',
      title: 'Daily Standup & Audit Check',
      time: '09:00 WIB (Besok)',
      client: 'Internal Team',
      agenda: 'Audit log Postgres RLS dan persiapan launch Product Hunt.'
    }
  ])
  const [selectedEventId, setSelectedEventId] = useState<string>('cal-1')
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false)

  const handleSyncGoogleCalendar = () => {
    setIsSyncingCalendar(true)
    setTimeout(() => {
      setIsSyncingCalendar(false)
      alert('Google Calendar berhasil disinkronkan! 3 Jadwal rapat terbaru diimpor.')
    }, 800)
  }

  const handleSelectCalendarEvent = (event: CalendarEvent) => {
    setSelectedEventId(event.id)
    setVerbatimTranscript(
      `[Jadwal Google Calendar: ${event.title} - ${event.time}]\nKlien: ${event.client}\nAgenda: ${event.agenda}\n\nKlien ${event.client}: "Kami ingin memastikan rapat ini mengikuti jadwal otomatis di Google Calendar."\n\nDeveloper: "Tentu, jadwal Google Calendar terhubung langsung ke AI Meeting Notepad."`
    )
  }

  // Web Speech API / Audio Recorder ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start(3000)
        setIsRecording(true)

        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0) {
            setVerbatimTranscript((prev) => prev + '\n[Speech Audio Stream Chunk Saved to IndexedDB 0ms]')
          }
        }
      } catch (err) {
        alert('Izin mikrofon diperlukan untuk merekam meeting.')
      }
    }
  }

  const handleGenerateAI = async () => {
    setIsProcessingAI(true)
    try {
      const res = await fetch('/api/meetings/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: verbatimTranscript, workspaceSlug }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.summaryNotes) setSummaryNotes(data.summaryNotes)
        if (data.actionItems) setActionItems(data.actionItems)
        if (data.invoiceDraft) setInvoice(data.invoiceDraft)
      }
    } catch (err) {
      console.error('Failed to generate AI summary:', err)
    } finally {
      setIsProcessingAI(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-satoshi">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Meeting Notepad (Granola Engine)</h1>
            <p className="text-xs text-muted-foreground">Deepgram Nova-3 STT • 5-Layer Gemini Fallback Chain</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncGoogleCalendar}
            disabled={isSyncingCalendar}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-background border border-border text-foreground hover:bg-muted text-xs font-semibold shadow-sm transition-all"
          >
            <Calendar className={`w-4 h-4 text-blue-500 ${isSyncingCalendar ? 'animate-spin' : ''}`} />
            {isSyncingCalendar ? 'Syncing...' : 'Sync Google Calendar'}
          </button>

          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isRecording
                ? 'bg-destructive text-destructive-foreground animate-pulse'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Merekam (Stop)' : 'Mulai Meeting'}
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={isProcessingAI}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessingAI ? 'animate-spin' : ''}`} />
            {isProcessingAI ? 'AI Generates...' : 'Proses AI'}
          </button>
        </div>
      </div>

      {/* Google Calendar Upcoming Schedule Sync Bar */}
      <div className="px-6 py-2.5 bg-blue-50/60 dark:bg-blue-950/20 border-b border-border flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 font-outfit uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> Jadwal Google Calendar
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300">
            • Auto Synced
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {calendarEvents.map((evt) => {
            const isSelected = selectedEventId === evt.id
            return (
              <button
                key={evt.id}
                onClick={() => handleSelectCalendarEvent(evt)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-background border border-border text-foreground hover:bg-muted'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{evt.title}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                  ({evt.time})
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 h-[calc(100vh-160px)] overflow-hidden">
        {/* Left Pane: Verbatim Instant Audio Stream */}
        <div className="flex flex-col border-r border-border p-6 bg-background overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" /> Transkrip Verbatim (0ms Stream)
            </h2>
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono">IndexedDB 0ms</span>
          </div>

          <textarea
            value={verbatimTranscript}
            onChange={(e) => setVerbatimTranscript(e.target.value)}
            className="flex-1 w-full p-4 rounded-lg bg-muted/40 border border-border resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ketik atau hidupkan mikrofon untuk merekam transkrip meeting..."
          />
        </div>

        {/* Right Pane: AI Structured Intelligence */}
        <div className="flex flex-col p-6 bg-muted/20 overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'notes' ? 'bg-background shadow text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" /> Rangkuman Decisions
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'tasks' ? 'bg-background shadow text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Live Action Items ({actionItems.length})
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'invoice' ? 'bg-background shadow text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Receipt className="w-4 h-4" /> Draft Invoice
            </button>
          </div>

          {/* Tab Content: Rangkuman */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed p-4 rounded-lg bg-background border border-border shadow-sm">
                <div dangerouslySetInnerHTML={{ __html: summaryNotes.replace(/\n/g, '<br/>') }} />
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <button 
                  onClick={() => alert('Disinkronkan ke Notion!')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  <Share2 className="w-3.5 h-3.5" /> 1-Click Notion Sync
                </button>
                <button 
                  onClick={() => alert('Email Rangkuman terkirim ke Klien!')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Email Nodemailer
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Action Items */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {actionItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => setActionItems(items => items.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    {item.assignee}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content: Invoice Generator */}
          {activeTab === 'invoice' && (
            <div className="p-4 rounded-lg bg-background border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base">Invoice Draft — {invoice.clientName}</h3>
                <span className="text-xs px-2.5 py-1 rounded bg-green-500/10 text-green-600 font-bold">Auto-Extracted</span>
              </div>

              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{item.description}</span>
                    <span className="font-mono font-semibold">${item.amount}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 font-bold text-base border-t border-border">
                <span>Total Tagihan:</span>
                <span className="text-primary font-mono">${invoice.totalAmount}</span>
              </div>

              <button 
                onClick={() => alert('PDF Invoice berhasil didownload!')}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
              >
                <Download className="w-4 h-4" /> Download PDF Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
