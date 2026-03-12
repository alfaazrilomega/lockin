"use client"

import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { getCalendarEvents } from "@/lib/actions/dashboard.actions"
import { type CalendarEvent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, success } = await getCalendarEvents()
        if (success && data) {
          // React Big Calendar expects Date objects for start/end
          const formattedEvents = data.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
          setEvents(formattedEvents)
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#6366f1" // primary
    if (event.type === "meeting") backgroundColor = "#10b981" // emerald
    if (event.type === "deadline") backgroundColor = "#ef4444" // red

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.8,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "12px",
        padding: "2px 6px",
      },
    }
  }

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi text-premium-black">
            Workspace Calendar
          </h1>
          <p className="text-muted-foreground">
            Track your deadlines, tasks, and meetings in one place.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
                Today
            </Button>
            <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r" onClick={() => {
                    const newDate = new Date(date)
                    if (view === 'month') newDate.setMonth(date.getMonth() - 1)
                    if (view === 'week') newDate.setDate(date.getDate() - 7)
                    if (view === 'day') newDate.setDate(date.getDate() - 1)
                    setDate(newDate)
                }}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => {
                   const newDate = new Date(date)
                   if (view === 'month') newDate.setMonth(date.getMonth() + 1)
                   if (view === 'week') newDate.setDate(date.getDate() + 7)
                   if (view === 'day') newDate.setDate(date.getDate() + 1)
                   setDate(newDate)
                }}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-xl font-satoshi">
            {format(date, "MMMM yyyy")}
          </CardTitle>
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
                variant={view === "month" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setView("month")}
            >
                Month
            </Button>
            <Button 
                variant={view === "week" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setView("week")}
            >
                Week
            </Button>
            <Button 
                variant={view === "day" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setView("day")}
            >
                Day
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] p-6">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={(v) => setView(v)}
              date={date}
              onNavigate={(d) => setDate(d)}
              toolbar={false}
              className="font-satoshi"
            />
          </div>
        </CardContent>
      </Card>
      
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-month-view {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid hsl(var(--border));
        }
        .rbc-header {
          padding: 12px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border)) !important;
        }
        .rbc-off-range-bg {
          background-color: transparent;
          opacity: 0.3;
        }
        .rbc-today {
          background-color: hsl(var(--primary) / 0.03);
        }
        .rbc-event {
          border-radius: 6px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .rbc-month-row {
          border-bottom: 1px solid hsl(var(--border));
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid hsl(var(--border));
        }
      `}</style>
    </div>
  )
}
