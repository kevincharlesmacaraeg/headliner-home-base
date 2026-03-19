import { google } from "googleapis"
import { Session } from "next-auth"

export function getOAuthClient(session: Session) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({
    access_token: (session as unknown as { accessToken: string }).accessToken,
  })
  return auth
}

export async function getCalendarEvents(auth: ReturnType<typeof getOAuthClient>) {
  const calendar = google.calendar({ version: "v3", auth })
  const now = new Date()
  const weekOut = new Date(now)
  weekOut.setDate(weekOut.getDate() + 7)

  const res = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID || "headlinercards@gmail.com",
    timeMin: now.toISOString(),
    timeMax: weekOut.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 30,
  })

  return res.data.items || []
}

export async function getSheetData(auth: ReturnType<typeof getOAuthClient>) {
  const sheets = google.sheets({ version: "v4", auth })
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!sheetId) return { headers: [], rows: [] }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:Z100",
  })

  const values = res.data.values || []
  if (values.length === 0) return { headers: [], rows: [] }

  const headers = values[0]
  const rows = values.slice(1).map((row) => {
    const obj: Record<string, string> = {}
    headers.forEach((h: string, i: number) => {
      obj[h] = row[i] || ""
    })
    return obj
  })

  return { headers, rows }
}
