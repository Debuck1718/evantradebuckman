import { CalendarEvent } from "../models/CalendarEvent";
import { CalendarOccurrence } from "../models/CalendarOccurrence";

function overlaps(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && startB < endA;
}

function addFrequency(date: Date, event: CalendarEvent): Date {
  const interval = event.recurrence?.interval ?? 1;
  const next = new Date(date);

  switch (event.recurrence?.frequency) {
    case "DAILY":
      next.setDate(next.getDate() + interval);
      return next;
    case "WEEKLY":
      next.setDate(next.getDate() + interval * 7);
      return next;
    case "MONTHLY":
      next.setMonth(next.getMonth() + interval);
      return next;
    default:
      return next;
  }
}

export function eventOccurrencesInRange(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): readonly CalendarOccurrence[] {
  if (event.status === "cancelled") {
    return [];
  }

  const durationMs =
    event.endAt.getTime() - event.startAt.getTime();

  if (!event.recurrence) {
    if (
      overlaps(
        event.startAt,
        event.endAt,
        rangeStart,
        rangeEnd,
      )
    ) {
      return [
        {
          eventId: event.id,
          startAt: new Date(event.startAt),
          endAt: new Date(event.endAt),
        },
      ];
    }

    return [];
  }

  const occurrences: CalendarOccurrence[] = [];
  let currentStart = new Date(event.startAt);
  let created = 0;

  while (currentStart < rangeEnd) {
    if (
      event.recurrence.count !== undefined &&
      created >= event.recurrence.count
    ) {
      break;
    }

    if (
      event.recurrence.until &&
      currentStart > event.recurrence.until
    ) {
      break;
    }

    const currentEnd = new Date(
      currentStart.getTime() + durationMs,
    );

    const validWeekday =
      !event.recurrence.byWeekday ||
      event.recurrence.byWeekday.length === 0 ||
      event.recurrence.byWeekday.includes(
        currentStart.getDay(),
      );

    if (
      validWeekday &&
      overlaps(currentStart, currentEnd, rangeStart, rangeEnd)
    ) {
      occurrences.push({
        eventId: event.id,
        startAt: new Date(currentStart),
        endAt: new Date(currentEnd),
      });
    }

    currentStart = addFrequency(currentStart, event);
    created += 1;

    if (created > 2048) {
      break;
    }
  }

  return occurrences;
}
