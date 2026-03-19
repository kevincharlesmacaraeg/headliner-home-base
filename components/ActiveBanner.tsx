"use client"

import { CalendarEvent } from "@/lib/types"

interface Props {
  events: CalendarEvent[]
}

export default function ActiveBanner({ events }: Props) {
  const today = new Date().toISOString().split("T")[0]
  const activeEvents = events.filter(
    (e) => e.allDay && e.start <= today && e.end > today
  )

  if (activeEvents.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeEvents.map((e) => (
        <div
          key={e.id}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          {e.title}
        </div>
      ))}
    </div>
  )
}
