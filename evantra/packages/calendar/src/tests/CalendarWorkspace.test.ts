import {
  describe,
  expect,
  it,
} from "vitest";

import { CalendarWorkspace } from "../CalendarWorkspace";

describe("CalendarWorkspace", () => {
  it("creates calendars and schedules events", () => {
    const workspace = new CalendarWorkspace();

    const calendar = workspace.createCalendar({
      ownerAccountId: "acc_1",
      name: "Main Workspace",
      timezone: "Africa/Accra",
      visibility: "organization",
    });

    const event = workspace.scheduleEvent({
      calendarId: calendar.id,
      title: "Weekly Standup",
      startAt: new Date("2026-08-10T09:00:00.000Z"),
      endAt: new Date("2026-08-10T09:30:00.000Z"),
      createdBy: "acc_1",
      attendeeIds: ["acc_1", "acc_2"],
    });

    expect(event.calendarId).toBe(calendar.id);
    expect(workspace.listEventsForCalendar(calendar.id)).toHaveLength(1);
  });

  it("detects overlap conflicts by default", () => {
    const workspace = new CalendarWorkspace();

    const calendar = workspace.createCalendar({
      ownerAccountId: "acc_1",
      name: "Team",
      timezone: "UTC",
    });

    workspace.scheduleEvent({
      calendarId: calendar.id,
      title: "Planning",
      startAt: new Date("2026-08-10T10:00:00.000Z"),
      endAt: new Date("2026-08-10T11:00:00.000Z"),
      createdBy: "acc_1",
    });

    expect(() =>
      workspace.scheduleEvent({
        calendarId: calendar.id,
        title: "Conflict",
        startAt: new Date("2026-08-10T10:30:00.000Z"),
        endAt: new Date("2026-08-10T11:30:00.000Z"),
        createdBy: "acc_1",
      }),
    ).toThrowError(/conflicts/i);
  });

  it("creates focus blocks for individual deep work", () => {
    const workspace = new CalendarWorkspace();

    const calendar = workspace.createCalendar({
      ownerAccountId: "acc_1",
      name: "Personal",
      timezone: "UTC",
    });

    const focus = workspace.reserveFocusBlock({
      calendarId: calendar.id,
      userId: "acc_1",
      startAt: new Date("2026-08-10T13:00:00.000Z"),
      endAt: new Date("2026-08-10T15:00:00.000Z"),
    });

    expect(focus.title).toBe("Deep Work Block");
    expect(focus.attendeeIds).toEqual(["acc_1"]);
  });

  it("supports recurring events in range queries", () => {
    const workspace = new CalendarWorkspace();

    const calendar = workspace.createCalendar({
      ownerAccountId: "acc_1",
      name: "Operations",
      timezone: "UTC",
    });

    workspace.scheduleEvent({
      calendarId: calendar.id,
      title: "Daily Brief",
      startAt: new Date("2026-08-10T08:00:00.000Z"),
      endAt: new Date("2026-08-10T08:30:00.000Z"),
      createdBy: "acc_1",
      recurrence: {
        frequency: "DAILY",
        count: 5,
      },
    });

    const items = workspace.eventsForRange(
      calendar.id,
      new Date("2026-08-12T00:00:00.000Z"),
      new Date("2026-08-12T23:59:59.000Z"),
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Daily Brief");
  });
});
