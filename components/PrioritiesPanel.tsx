"use client"

import { useState } from "react"

interface Priority {
  id: string
  text: string
  done: boolean
}

interface Props {
  initial?: Priority[]
}

export default function PrioritiesPanel({ initial = [] }: Props) {
  const [priorities, setPriorities] = useState<Priority[]>(
    initial.length > 0
      ? initial
      : [
          { id: "1", text: "Trust Me release week — monitor rollout", done: false },
          { id: "2", text: "Follow up on Laundry Day collab", done: false },
          { id: "3", text: "Prep Danny X Headliner Cards call", done: false },
        ]
  )
  const [newText, setNewText] = useState("")

  const toggle = (id: string) => {
    setPriorities((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p))
    )
  }

  const add = () => {
    if (!newText.trim()) return
    setPriorities((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newText.trim(), done: false },
    ])
    setNewText("")
  }

  const remove = (id: string) => {
    setPriorities((prev) => prev.filter((p) => p.id !== id))
  }

  const done = priorities.filter((p) => p.done).length
  const total = priorities.length

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Today&apos;s Priorities
        </h2>
        <span className="text-xs text-gray-500">{done}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
        />
      </div>

      <div className="space-y-2 mb-3">
        {priorities.map((p) => (
          <div key={p.id} className="flex items-start gap-2 group">
            <button
              onClick={() => toggle(p.id)}
              className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                p.done
                  ? "bg-yellow-400 border-yellow-400"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              {p.done && (
                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm leading-snug ${p.done ? "line-through text-gray-600" : "text-white"}`}>
              {p.text}
            </span>
            <button
              onClick={() => remove(p.id)}
              className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="flex gap-2 mt-3">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a priority..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/40 focus:bg-white/10 transition-all"
        />
        <button
          onClick={add}
          className="text-xs px-3 py-1.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
}
