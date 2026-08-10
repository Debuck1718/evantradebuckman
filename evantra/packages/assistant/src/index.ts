export type AssistantScope = {
  ownerAccountId: string;
  organizationId?: string;
  allowedDatasets: readonly string[];
};

export type AssistantIntent =
  | "weekly-priorities"
  | "project-status"
  | "goal-risk"
  | "context-collection"
  | "deadline-focus";

export interface AssistantQuery {
  intent: AssistantIntent;
  question: string;
  filters?: Record<string, string>;
}

export interface AssistantInsight {
  summary: string;
  actionItems: readonly string[];
  evidence: readonly { source: string; reference: string }[];
}

export interface WorkspaceContextProvider {
  resolveContext(scope: AssistantScope, query: AssistantQuery): Promise<{
    priorities: readonly string[];
    projects: readonly string[];
    goalsAtRisk: readonly string[];
    relatedItems: readonly string[];
  }>;
}

export type AssistantDataset =
  | "planning"
  | "knowledge"
  | "calendar"
  | "finance";

export interface AssistantDomainSources {
  listPriorityTasks?(scope: AssistantScope): Promise<readonly string[]>;
  listProjects?(scope: AssistantScope): Promise<readonly string[]>;
  listGoalsAtRisk?(scope: AssistantScope): Promise<readonly string[]>;
  listRelatedItems?(scope: AssistantScope, query: AssistantQuery): Promise<readonly string[]>;
}

export class AuthorizedWorkspaceContextProvider implements WorkspaceContextProvider {
  constructor(private readonly sources: AssistantDomainSources) {}

  async resolveContext(scope: AssistantScope, query: AssistantQuery): Promise<{
    priorities: readonly string[];
    projects: readonly string[];
    goalsAtRisk: readonly string[];
    relatedItems: readonly string[];
  }> {
    const allowed = new Set(scope.allowedDatasets);

    const priorities =
      allowed.has("planning") && this.sources.listPriorityTasks
        ? await this.sources.listPriorityTasks(scope)
        : [];

    const projects =
      allowed.has("planning") && this.sources.listProjects
        ? await this.sources.listProjects(scope)
        : [];

    const goalsAtRisk =
      allowed.has("planning") && this.sources.listGoalsAtRisk
        ? await this.sources.listGoalsAtRisk(scope)
        : [];

    const relatedItems =
      allowed.has("knowledge") && this.sources.listRelatedItems
        ? await this.sources.listRelatedItems(scope, query)
        : [];

    return {
      priorities,
      projects,
      goalsAtRisk,
      relatedItems,
    };
  }
}

export class WorkspaceAssistant {
  constructor(private readonly provider: WorkspaceContextProvider) {}

  async answer(scope: AssistantScope, query: AssistantQuery): Promise<AssistantInsight> {
    const context = await this.provider.resolveContext(scope, query);

    const summary = this.buildSummary(query.intent, context);

    const actionItems = this.buildActionItems(query.intent, context);

    const evidence = [
      ...context.priorities.map(value => ({ source: "priority", reference: value })),
      ...context.projects.map(value => ({ source: "project", reference: value })),
      ...context.goalsAtRisk.map(value => ({ source: "goal-risk", reference: value })),
      ...context.relatedItems.map(value => ({ source: "related", reference: value })),
    ];

    return {
      summary,
      actionItems,
      evidence,
    };
  }

  private buildSummary(
    intent: AssistantIntent,
    context: {
      priorities: readonly string[];
      projects: readonly string[];
      goalsAtRisk: readonly string[];
      relatedItems: readonly string[];
    },
  ): string {
    switch (intent) {
      case "weekly-priorities":
        return `You have ${context.priorities.length} priority items this week across ${context.projects.length} active projects.`;
      case "project-status":
        return `You are currently working across ${context.projects.length} projects with ${context.goalsAtRisk.length} goal risks requiring attention.`;
      case "goal-risk":
        return `${context.goalsAtRisk.length} goals appear at risk based on current deadlines and progress.`;
      case "context-collection":
        return `Found ${context.relatedItems.length} related workspace items for your request.`;
      case "deadline-focus":
        return `There are ${context.priorities.length} deadline-linked priorities to focus on now.`;
      default:
        return "Workspace context summary is available.";
    }
  }

  private buildActionItems(
    intent: AssistantIntent,
    context: {
      priorities: readonly string[];
      projects: readonly string[];
      goalsAtRisk: readonly string[];
      relatedItems: readonly string[];
    },
  ): readonly string[] {
    if (intent === "goal-risk") {
      return context.goalsAtRisk.slice(0, 5).map(item => `Review and re-plan goal: ${item}`);
    }

    if (intent === "context-collection") {
      return context.relatedItems.slice(0, 5).map(item => `Open related item: ${item}`);
    }

    return context.priorities.slice(0, 5).map(item => `Prioritize: ${item}`);
  }
}
