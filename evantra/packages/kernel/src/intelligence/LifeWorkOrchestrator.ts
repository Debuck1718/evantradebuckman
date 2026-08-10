import {
  BurdenAssessment,
  BurdenEngine,
  BurdenSnapshot,
} from "./BurdenEngine";

import {
  PromiseCommitment,
  PromiseGraph,
  PromiseScope,
} from "./PromiseGraph";

export interface LifeWorkSignalInput {
  scope: PromiseScope;
  burden: BurdenSnapshot;
  topTasks: readonly { id: string; title: string; dueAt?: Date; blocked?: boolean }[];
  upcomingEvents: readonly { id: string; title: string; startAt: Date }[];
}

export interface LifeWorkPlan {
  generatedAt: Date;
  burden: BurdenAssessment;
  topFocus: readonly string[];
  promisesDueSoon: readonly PromiseCommitment[];
  guardrails: readonly string[];
}

export class LifeWorkOrchestrator {
  constructor(
    private readonly burdenEngine: BurdenEngine,
    private readonly promiseGraph: PromiseGraph,
  ) {}

  plan(input: LifeWorkSignalInput): LifeWorkPlan {
    const burden = this.burdenEngine.assess(input.burden);
    const promisesDueSoon = this.promiseGraph.dueSoon(input.scope);

    const topFocus = input.topTasks
      .slice()
      .sort((a, b) => {
        if (Boolean(b.blocked) !== Boolean(a.blocked)) {
          return b.blocked ? 1 : -1;
        }

        if (a.dueAt && b.dueAt) {
          return a.dueAt.getTime() - b.dueAt.getTime();
        }

        if (a.dueAt) {
          return -1;
        }

        if (b.dueAt) {
          return 1;
        }

        return 0;
      })
      .slice(0, 5)
      .map(task => task.title);

    const guardrails = [
      ...burden.recommendations,
      promisesDueSoon.length > 0
        ? `You have ${promisesDueSoon.length} commitment(s) due in the next 72 hours.`
        : "No urgent commitments due in the next 72 hours.",
      input.upcomingEvents.length > 6
        ? "Meeting load is high. Protect at least one focus block."
        : "Meeting load is manageable for deep work.",
    ];

    return {
      generatedAt: new Date(),
      burden,
      topFocus,
      promisesDueSoon,
      guardrails,
    };
  }
}
