export type DashboardScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export interface DashboardPriority {
  id: string;
  title: string;
  reason: string;
  dueAt?: Date;
  source: "task" | "goal" | "project" | "calendar" | "finance" | "system";
}

export interface DashboardSnapshot {
  scope: DashboardScope;
  generatedAt: Date;
  priorities: readonly DashboardPriority[];
  upcomingEvents: readonly { id: string; title: string; startAt: Date }[];
  reminders: readonly { id: string; message: string; dueAt?: Date }[];
  goalProgress: readonly { goalId: string; title: string; progressPercent: number }[];
  financeOverview?: { income: number; expenses: number; balance: number };
  learningProgress?: readonly { track: string; progressPercent: number }[];
}

export interface DashboardSources {
  getPriorities(scope: DashboardScope): Promise<readonly DashboardPriority[]>;
  getUpcomingEvents(scope: DashboardScope): Promise<readonly { id: string; title: string; startAt: Date }[]>;
  getReminders(scope: DashboardScope): Promise<readonly { id: string; message: string; dueAt?: Date }[]>;
  getGoalProgress(scope: DashboardScope): Promise<readonly { goalId: string; title: string; progressPercent: number }[]>;
  getFinanceOverview?(scope: DashboardScope): Promise<{ income: number; expenses: number; balance: number }>;
  getLearningProgress?(scope: DashboardScope): Promise<readonly { track: string; progressPercent: number }[]>;
}

export interface PlanningDashboardTask {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "blocked" | "done" | "cancelled";
  dueAt?: Date;
}

export interface PlanningDashboardSource {
  listTasks(scope: DashboardScope): Promise<readonly PlanningDashboardTask[]>;
  listGoalProgress(scope: DashboardScope): Promise<readonly { goalId: string; title: string; progressPercent: number }[]>;
}

export interface CalendarDashboardSource {
  listUpcomingEvents(scope: DashboardScope, startAt: Date, endAt: Date): Promise<readonly { id: string; title: string; startAt: Date }[]>;
}

export interface FinanceDashboardSource {
  getOverview(scope: DashboardScope): Promise<{ income: number; expenses: number; balance: number }>;
}

export interface DashboardAdapterOptions {
  now?: Date;
  horizonDays?: number;
}

export function createDashboardSourcesFromDomains(
  planning: PlanningDashboardSource,
  calendar: CalendarDashboardSource,
  finance?: FinanceDashboardSource,
  options?: DashboardAdapterOptions,
): DashboardSources {
  const now = options?.now ?? new Date();
  const horizonDays = options?.horizonDays ?? 14;
  const horizonEnd = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);

  return {
    async getPriorities(scope: DashboardScope): Promise<readonly DashboardPriority[]> {
      const tasks = await planning.listTasks(scope);

      const priorities = tasks
        .filter(task => task.status !== "done" && task.status !== "cancelled")
        .map(task => {
          const blocked = task.status === "blocked";
          const nearDeadline = Boolean(task.dueAt && task.dueAt.getTime() <= now.getTime() + 72 * 60 * 60 * 1000);

          let reason = "Active task";
          if (blocked) {
            reason = "Blocked and needs intervention";
          } else if (task.dueAt && task.dueAt < now) {
            reason = "Overdue";
          } else if (nearDeadline) {
            reason = "Due soon";
          }

          return {
            id: task.id,
            title: task.title,
            dueAt: task.dueAt,
            source: "task" as const,
            reason,
            score: blocked ? 100 : task.dueAt && task.dueAt < now ? 90 : nearDeadline ? 80 : 50,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map(item => ({
          id: item.id,
          title: item.title,
          reason: item.reason,
          dueAt: item.dueAt,
          source: item.source,
        }));

      return priorities;
    },

    async getUpcomingEvents(scope: DashboardScope): Promise<readonly { id: string; title: string; startAt: Date }[]> {
      return calendar.listUpcomingEvents(scope, now, horizonEnd);
    },

    async getReminders(scope: DashboardScope): Promise<readonly { id: string; message: string; dueAt?: Date }[]> {
      const tasks = await planning.listTasks(scope);

      return tasks
        .filter(task => task.status !== "done" && task.status !== "cancelled")
        .filter(task => Boolean(task.dueAt) && (task.dueAt! < now || task.dueAt!.getTime() <= now.getTime() + 48 * 60 * 60 * 1000))
        .slice(0, 20)
        .map(task => ({
          id: task.id,
          message: task.dueAt! < now ? `Task overdue: ${task.title}` : `Upcoming due task: ${task.title}`,
          dueAt: task.dueAt,
        }));
    },

    async getGoalProgress(scope: DashboardScope): Promise<readonly { goalId: string; title: string; progressPercent: number }[]> {
      return planning.listGoalProgress(scope);
    },

    async getFinanceOverview(scope: DashboardScope): Promise<{ income: number; expenses: number; balance: number }> {
      if (!finance) {
        return { income: 0, expenses: 0, balance: 0 };
      }

      return finance.getOverview(scope);
    },
  };
}

export class LifeDashboardComposer {
  constructor(private readonly sources: DashboardSources) {}

  async compose(scope: DashboardScope): Promise<DashboardSnapshot> {
    const [priorities, upcomingEvents, reminders, goalProgress] = await Promise.all([
      this.sources.getPriorities(scope),
      this.sources.getUpcomingEvents(scope),
      this.sources.getReminders(scope),
      this.sources.getGoalProgress(scope),
    ]);

    const financeOverview = this.sources.getFinanceOverview
      ? await this.sources.getFinanceOverview(scope)
      : undefined;

    const learningProgress = this.sources.getLearningProgress
      ? await this.sources.getLearningProgress(scope)
      : undefined;

    return {
      scope,
      generatedAt: new Date(),
      priorities,
      upcomingEvents,
      reminders,
      goalProgress,
      financeOverview,
      learningProgress,
    };
  }
}
