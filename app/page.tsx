"use client"

import { useSession, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import PrioritiesPanel from "@/components/PrioritiesPanel"
import CalendarPanel from "@/components/CalendarPanel"
import TeamStatus from "@/components/TeamStatus"
import SheetPanel from "@/components/SheetPanel"
import ActiveBanner from "@/components/ActiveBanner"
import { CalendarEvent } from "@/lib/types"

export default function Home() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [sheetData, setSheetData] = useState<{ headers: string[]; rows: Record<string, string>[]; error?: string }>({ headers: [], rows: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch("/api/calendar").then((r) => r.json()),
      fetch("/api/sheets").then((r) => r.json()),
    ]).then(([cal, sheet]) => {
      setEvents(Array.isArray(cal) ? cal : [])
      setSheetData(sheet.error ? { headers: [], rows: [], error: sheet.error } : sheet)
      setLoading(false)
    })
  }, [session])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            Headliner Cards <span className="text-yellow-400">Home Base</span>
          </h1>
          <p className="text-sm text-gray-500 mb-8">Team dashboard</p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center gap-3 bg-white text-gray-900 font-semibold px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors mx-auto"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          <p className="text-xs text-gray-600 mt-4">Use headlinercards@gmail.com for full access</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Active all-day events banner */}
        <ActiveBanner events={events} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <TeamStatus events={events} />
              <PrioritiesPanel />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <CalendarPanel events={events} />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <SheetPanel
                headers={sheetData.headers}
                rows={sheetData.rows}
                error={sheetData.error}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
