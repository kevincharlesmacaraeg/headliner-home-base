import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getOAuthClient, getSheetData } from "@/lib/google"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const client = getOAuthClient(session)
    const data = await getSheetData(client)
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch sheet" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { range, values } = body

  try {
    const { google } = await import("googleapis")
    const client = getOAuthClient(session)
    const sheets = google.sheets({ version: "v4", auth: client })

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update sheet" }, { status: 500 })
  }
}
