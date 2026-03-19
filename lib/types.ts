export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay: boolean
  organizer?: string
  location?: string
  attendees?: number
}

export interface TeamMember {
  name: string
  status: "in" | "out" | "traveling"
  note?: string
  returnDate?: string
}

export interface Priority {
  id: string
  text: string
  done: boolean
  assignee?: string
}

export interface SheetRow {
  [key: string]: string
}
