import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getOAuthClient, getCalendarEvents } from "@/lib/google"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const client = getOAuthClient(session)
    const events = await getCalendarEvents(client)

    const formatted = events.map((e) => ({
      id: e.id,
      title: e.summary || "(No title)",
      start: e.start?.dateTime || e.start?.date || "",
      end: e.end?.dateTime || e.end?.date || "",
      allDay: !e.start?.dateTime,
      organizer: e.organizer?.email,
      location: e.location,
      attendees: e.attendees?.length,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}
