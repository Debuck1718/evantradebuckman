import { describe, expect, it } from "vitest";

import {
  BurdenEngine,
  LifeWorkOrchestrator,
  PromiseGraph,
} from "../index";

describe("Kernel intelligence services", () => {
  it("assesses burden and returns actionable guidance", () => {
    const engine = new BurdenEngine();

    const assessment = engine.assess({
      scope: { ownerAccountId: "acc_1" },
      openTasks: 18,
      blockedTasks: 3,
      overdueTasks: 4,
      meetingsMinutesToday: 360,
      focusMinutesToday: 45,
      recoveryMinutesToday: 20,
      commitmentsDueSoon: 2,
    });

    expect(assessment.score).toBeGreaterThan(60);
    expect(["high", "critical"]).toContain(assessment.band);
    expect(assessment.recommendations.length).toBeGreaterThan(0);
  });

  it("tracks promise lifecycle and due-soon commitments", () => {
    const graph = new PromiseGraph();

    const commitment = graph.create({
      scope: { ownerAccountId: "acc_1" },
      ownerAccountId: "acc_1",
      title: "Deliver investor update",
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    graph.activate(commitment.id);

    const dueSoon = graph.dueSoon({ ownerAccountId: "acc_1" });

    expect(dueSoon).toHaveLength(1);
    expect(dueSoon[0]?.status).toBe("active");
  });

  it("creates a unified life-work plan", () => {
    const burdenEngine = new BurdenEngine();
    const promiseGraph = new PromiseGraph();

    promiseGraph.activate(
      promiseGraph.create({
        scope: { ownerAccountId: "acc_1" },
        ownerAccountId: "acc_1",
        title: "Finalize hiring scorecards",
        dueAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
      }).id,
    );

    const orchestrator = new LifeWorkOrchestrator(
      burdenEngine,
      promiseGraph,
    );

    const plan = orchestrator.plan({
      scope: { ownerAccountId: "acc_1" },
      burden: {
        scope: { ownerAccountId: "acc_1" },
        openTasks: 10,
        blockedTasks: 1,
        overdueTasks: 1,
        meetingsMinutesToday: 180,
        focusMinutesToday: 120,
        recoveryMinutesToday: 40,
        commitmentsDueSoon: 1,
      },
      topTasks: [
        { id: "t1", title: "Fix release blocker", blocked: true },
        { id: "t2", title: "Prepare board memo", dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000) },
      ],
      upcomingEvents: [
        { id: "e1", title: "Ops review", startAt: new Date(Date.now() + 60 * 60 * 1000) },
      ],
    });

    expect(plan.topFocus.length).toBeGreaterThan(0);
    expect(plan.promisesDueSoon.length).toBe(1);
    expect(plan.guardrails.length).toBeGreaterThan(1);
  });
});
