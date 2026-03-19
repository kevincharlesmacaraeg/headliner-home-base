"use client"

import { CalendarEvent } from "@/lib/types"

interface Props {
  events: CalendarEvent[]
}

// Detect team status events from all-day calendar entries
function parseTeamStatus(events: CalendarEvent[]) {
  const outKeywords = ["out", "away", "vacation", "travel", "off", "leave", "vietnam", "gone"]
  const today = new Date().toISOString().split("T")[0]

  return events.filter((e) => {
    if (!e.allDay) return false
    const title = e.title.toLowerCase()
    const isActive = e.start <= today && e.end > today
    return isActive && outKeywords.some((k) => title.includes(k))
  })
}

const STATUS_COLORS: Record<string, string> = {
  in: "bg-green-500",
  out: "bg-red-500",
  traveling: "bg-amber-500",
}

// Static team roster — update as your team grows
const TEAM = ["Kevin", "Sam", "Tiff", "Tia"]

export default function TeamStatus({ events }: Props) {
  const outEvents = parseTeamStatus(events)
  const outNames = outEvents.map((e) => e.title.toLowerCase())

  const members = TEAM.map((name) => {
    const out = outNames.some((n) => n.includes(name.toLowerCase()))
    const event = outEvents.find((e) => e.title.toLowerCase().includes(name.toLowerCase()))
    return {
      name,
      status: out ? "out" : "in",
      note: event?.title,
      returnDate: event?.end,
    }
  })

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Team Status</h2>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[m.status]}`} />
              <span className="text-sm text-white font-medium">{m.name}</span>
            </div>
            <div className="text-right">
              {m.status === "out" ? (
                <span className="text-xs text-red-400">
                  Out{m.returnDate ? ` → back ${new Date(m.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                </span>
              ) : (
                <span className="text-xs text-green-400">In</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
