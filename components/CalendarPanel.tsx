"use client"

import { CalendarEvent } from "@/lib/types"

interface Props {
  events: CalendarEvent[]
}

function formatTime(dateStr: string) {
  if (!dateStr.includes("T")) return "All day"
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function isToday(dateStr: string) {
  const today = new Date().toISOString().split("T")[0]
  return dateStr.startsWith(today)
}

function dayLabel(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export default function CalendarPanel({ events }: Props) {
  const timedEvents = events.filter((e) => !e.allDay)
  const todayEvents = timedEvents.filter((e) => isToday(e.start))
  const upcomingEvents = timedEvents.filter((e) => !isToday(e.start)).slice(0, 6)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-4">
      {/* Today */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Today&apos;s Meetings
        </h2>
        {todayEvents.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Nothing scheduled today</p>
        ) : (
          <div className="space-y-2">
            {todayEvents.map((e) => (
              <EventRow key={e.id} event={e} highlight />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Coming Up
          </h2>
          <div className="space-y-2">
            {upcomingEvents.map((e) => (
              <EventRow key={e.id} event={e} label={dayLabel(e.start)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EventRow({ event, highlight, label }: { event: CalendarEvent; highlight?: boolean; label?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg px-3 py-2 ${highlight ? "bg-yellow-400/10 border border-yellow-400/20" : "bg-white/5"}`}>
      <div className="shrink-0 text-right min-w-[52px]">
        <div className={`text-xs font-mono ${highlight ? "text-yellow-400" : "text-gray-400"}`}>
          {label || formatTime(event.start)}
        </div>
        {label && (
          <div className="text-xs text-gray-600">{formatTime(event.start)}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{event.title}</p>
        {event.attendees && event.attendees > 1 && (
          <p className="text-xs text-gray-500">{event.attendees} attendees</p>
        )}
      </div>
    </div>
  )
}
