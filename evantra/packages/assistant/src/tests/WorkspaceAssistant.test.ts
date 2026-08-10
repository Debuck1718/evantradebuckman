import { describe, expect, it } from "vitest";

import {
  AuthorizedWorkspaceContextProvider,
  WorkspaceAssistant,
} from "../index";

describe("WorkspaceAssistant", () => {
  it("respects allowed dataset scope", async () => {
    const provider = new AuthorizedWorkspaceContextProvider({
      listPriorityTasks: async () => ["Task A", "Task B"],
      listProjects: async () => ["Project One"],
      listGoalsAtRisk: async () => ["Goal X"],
      listRelatedItems: async () => ["Knowledge Secret"],
    });

    const context = await provider.resolveContext(
      {
        ownerAccountId: "acc_1",
        allowedDatasets: ["planning"],
      },
      {
        intent: "context-collection",
        question: "Summarize my workspace.",
      },
    );

    expect(context.priorities).toHaveLength(2);
    expect(context.projects).toHaveLength(1);
    expect(context.goalsAtRisk).toHaveLength(1);
    expect(context.relatedItems).toHaveLength(0);
  });

  it("returns evidence-backed insights", async () => {
    const provider = new AuthorizedWorkspaceContextProvider({
      listPriorityTasks: async () => ["Ship billing"],
      listProjects: async () => ["Finance Revamp"],
      listGoalsAtRisk: async () => ["Improve runway"],
    });

    const assistant = new WorkspaceAssistant(provider);

    const insight = await assistant.answer(
      {
        ownerAccountId: "acc_1",
        allowedDatasets: ["planning"],
      },
      {
        intent: "goal-risk",
        question: "Which goals are at risk?",
      },
    );

    expect(insight.summary).toContain("goals appear at risk");
    expect(insight.actionItems[0]).toContain("Review and re-plan goal");
    expect(insight.evidence.some(item => item.source === "goal-risk")).toBe(true);
  });
});
