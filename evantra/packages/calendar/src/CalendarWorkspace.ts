import { createId } from "./utils/createId";

import { Calendar } from "./models/Calendar";
import { CalendarEvent } from "./models/CalendarEvent";
import { eventOccurrencesInRange } from "./utils/occurrences";

interface CreateCalendarInput {
  ownerAccountId: string;
  organizationId?: string;
  name: string;
  timezone: string;
  visibility?: Calendar["visibility"];
}

interface ScheduleEventInput {
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  startAt: Date;
  endAt: Date;
  allDay?: boolean;
  createdBy: string;
  attendeeIds?: readonly string[];
  recurrence?: CalendarEvent["recurrence"];
  allowConflicts?: boolean;
}

interface FocusBlockInput {
  calendarId: string;
  userId: string;
  title?: string;
  startAt: Date;
  endAt: Date;
}

function rangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && startB < endA;
}

/**
 * In-memory calendar workspace service.
 * This is the foundation for workspace scheduling,
 * invitation, and focus planning.
 */
export class CalendarWorkspace {
  private readonly calendars = new Map<string, Calendar>();
  private readonly events = new Map<string, CalendarEvent>();

  createCalendar(input: CreateCalendarInput): Calendar {
    if (!input.ownerAccountId.trim()) {
      throw new Error("ownerAccountId is required.");
    }

    if (!input.name.trim()) {
      throw new Error("Calendar name is required.");
    }

    if (!input.timezone.trim()) {
      throw new Error("Calendar timezone is required.");
    }

    const now = new Date();

    const calendar: Calendar = {
      id: createId(),
      ownerAccountId: input.ownerAccountId.trim(),
      organizationId: input.organizationId,
      name: input.name.trim(),
      timezone: input.timezone.trim(),
      visibility: input.visibility ?? "private",
      createdAt: now,
      updatedAt: now,
    };

    this.calendars.set(calendar.id, calendar);

    return calendar;
  }

  scheduleEvent(input: ScheduleEventInput): CalendarEvent {
    this.requireCalendar(input.calendarId);

    if (!input.title.trim()) {
      throw new Error("Event title is required.");
    }

    if (input.endAt <= input.startAt) {
      throw new Error("Event endAt must be after startAt.");
    }

    if (!input.allowConflicts) {
      const conflicts = this.findConflicts(
        input.calendarId,
        input.startAt,
        input.endAt,
      );

      if (conflicts.length > 0) {
        throw new Error("Event conflicts with existing schedule.");
      }
    }

    const now = new Date();
    const attendees = input.attendeeIds ?? [];

    const event: CalendarEvent = {
      id: createId(),
      calendarId: input.calendarId,
      title: input.title.trim(),
      description: input.description?.trim(),
      location: input.location?.trim(),
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
      allDay: input.allDay ?? false,
      createdBy: input.createdBy,
      attendeeIds: [...new Set(attendees)],
      recurrence: input.recurrence,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    };

    this.events.set(event.id, event);

    return event;
  }

  reserveFocusBlock(input: FocusBlockInput): CalendarEvent {
    return this.scheduleEvent({
      calendarId: input.calendarId,
      title: input.title?.trim() || "Deep Work Block",
      startAt: input.startAt,
      endAt: input.endAt,
      createdBy: input.userId,
      attendeeIds: [input.userId],
      description:
        "Auto-reserved focus block for high-value individual work.",
      allowConflicts: false,
    });
  }

  findConflicts(
    calendarId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): readonly CalendarEvent[] {
    const horizonStart = new Date(
      rangeStart.getTime() - 1000 * 60 * 60 * 24 * 30,
    );
    const horizonEnd = new Date(
      rangeEnd.getTime() + 1000 * 60 * 60 * 24 * 30,
    );

    return this.listEventsForCalendar(calendarId).filter(event => {
      const occurrences = eventOccurrencesInRange(
        event,
        horizonStart,
        horizonEnd,
      );

      return occurrences.some(occurrence =>
        rangesOverlap(
          occurrence.startAt,
          occurrence.endAt,
          rangeStart,
          rangeEnd,
        ),
      );
    });
  }

  eventsForRange(
    calendarId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): readonly CalendarEvent[] {
    return this.listEventsForCalendar(calendarId).filter(event =>
      eventOccurrencesInRange(event, rangeStart, rangeEnd).length > 0,
    );
  }

  listCalendarsByOwner(
    ownerAccountId: string,
  ): readonly Calendar[] {
    return [...this.calendars.values()].filter(
      calendar => calendar.ownerAccountId === ownerAccountId,
    );
  }

  listEventsForCalendar(
    calendarId: string,
  ): readonly CalendarEvent[] {
    return [...this.events.values()]
      .filter(event => event.calendarId === calendarId)
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }

  cancelEvent(eventId: string): CalendarEvent {
    const event = this.events.get(eventId);

    if (!event) {
      throw new Error(`Event '${eventId}' not found.`);
    }

    event.status = "cancelled";
    event.updatedAt = new Date();

    return event;
  }

  private requireCalendar(
    calendarId: string,
  ): Calendar {
    const calendar = this.calendars.get(calendarId);

    if (!calendar) {
      throw new Error(`Calendar '${calendarId}' not found.`);
    }

    return calendar;
  }
}
