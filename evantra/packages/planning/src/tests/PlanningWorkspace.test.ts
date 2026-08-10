import { describe, expect, it } from "vitest";

import { PlanningWorkspace } from "../index";

describe("PlanningWorkspace", () => {
  it("builds goal to project to task hierarchy", () => {
    const planning = new PlanningWorkspace();

    const goal = planning.createGoal({
      scope: { ownerAccountId: "acc_1" },
      area: "business",
      title: "Build Evantra StoreForge",
    });

    const project = planning.createProject({
      goalId: goal.id,
      scope: { ownerAccountId: "acc_1" },
      name: "Storefront architecture",
    });

    planning.createTask({
      projectId: project.id,
      title: "Database",
    });

    planning.createTask({
      projectId: project.id,
      title: "Authentication",
      status: "done",
    });

    const hierarchy = planning.hierarchy(goal.id);

    expect(hierarchy.goal.id).toBe(goal.id);
    expect(hierarchy.projects).toHaveLength(1);
    expect(hierarchy.tasks).toHaveLength(2);
    expect(planning.progressForGoal(goal.id)).toBe(50);
  });

  it("detects blockers and computes workload", () => {
    const planning = new PlanningWorkspace();

    const goal = planning.createGoal({
      scope: { ownerAccountId: "acc_1" },
      area: "career",
      title: "Improve delivery health",
    });

    const project = planning.createProject({
      goalId: goal.id,
      scope: { ownerAccountId: "acc_1" },
      name: "Platform stability",
    });

    const doneTask = planning.createTask({
      projectId: project.id,
      title: "Define standards",
      status: "done",
      assigneeAccountId: "worker_1",
    });

    const blockedByDependency = planning.createTask({
      projectId: project.id,
      title: "Ship migration",
      status: "in-progress",
      assigneeAccountId: "worker_1",
    });

    const overdueTask = planning.createTask({
      projectId: project.id,
      title: "Write runbook",
      dueAt: new Date("2026-01-01T10:00:00.000Z"),
      assigneeAccountId: "worker_2",
    });

    planning.addDependency(blockedByDependency.id, doneTask.id);
    planning.setTaskStatus(doneTask.id, "todo");

    const blockers = planning.blockers(
      { ownerAccountId: "acc_1" },
      new Date("2026-02-01T10:00:00.000Z"),
    );

    expect(blockers).toHaveLength(2);
    expect(blockers.find(item => item.task.id === blockedByDependency.id)?.reason).toBe("dependency-pending");
    expect(blockers.find(item => item.task.id === overdueTask.id)?.reason).toBe("overdue");

    const workload = planning.workload(
      { ownerAccountId: "acc_1" },
      new Date("2026-02-01T10:00:00.000Z"),
    );

    expect(workload[0]?.assigneeAccountId).toBe("worker_2");
    expect(workload[0]?.overdueCount).toBe(1);
    expect(workload[1]?.assigneeAccountId).toBe("worker_1");
    expect(workload[1]?.blockedCount).toBe(1);
  });

  it("prevents dependency cycles", () => {
    const planning = new PlanningWorkspace();

    const project = planning.createProject({
      scope: { ownerAccountId: "acc_1" },
      name: "Cycle safety",
    });

    const a = planning.createTask({ projectId: project.id, title: "A" });
    const b = planning.createTask({ projectId: project.id, title: "B" });

    planning.addDependency(a.id, b.id);

    expect(() => planning.addDependency(b.id, a.id)).toThrow("Dependency would create a cycle.");
  });
});
