import { describe, expect, it } from "vitest";

import {
  createDashboardSourcesFromDomains,
  LifeDashboardComposer,
} from "../index";

describe("LifeDashboardComposer", () => {
  it("composes a cross-domain dashboard snapshot", async () => {
    const now = new Date("2026-08-09T09:00:00.000Z");

    const sources = createDashboardSourcesFromDomains(
      {
        listTasks: async () => [
          { id: "t1", title: "Pay vendor", status: "blocked", dueAt: new Date("2026-08-10T10:00:00.000Z") },
          { id: "t2", title: "Review roadmap", status: "todo", dueAt: new Date("2026-08-09T12:00:00.000Z") },
        ],
        listGoalProgress: async () => [{ goalId: "g1", title: "Scale workspace", progressPercent: 44 }],
      },
      {
        listUpcomingEvents: async () => [{ id: "e1", title: "Client sync", startAt: new Date("2026-08-11T14:00:00.000Z") }],
      },
      {
        getOverview: async () => ({ income: 8000, expenses: 5000, balance: 3000 }),
      },
      { now },
    );

    const dashboard = new LifeDashboardComposer(sources);

    const snapshot = await dashboard.compose({ ownerAccountId: "acc_1" });

    expect(snapshot.priorities).toHaveLength(2);
    expect(snapshot.priorities[0]?.title).toBe("Pay vendor");
    expect(snapshot.reminders).toHaveLength(2);
    expect(snapshot.goalProgress[0]?.progressPercent).toBe(44);
    expect(snapshot.financeOverview?.balance).toBe(3000);
  });
});
