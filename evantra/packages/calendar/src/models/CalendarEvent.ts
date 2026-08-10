import { RecurrenceRule } from "./Recurrence";

export type CalendarEventStatus =
  | "confirmed"
  | "tentative"
  | "cancelled";

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt: Date;
  allDay: boolean;
  createdBy: string;
  attendeeIds: readonly string[];
  recurrence?: RecurrenceRule;
  status: CalendarEventStatus;
  createdAt: Date;
  updatedAt: Date;
}
