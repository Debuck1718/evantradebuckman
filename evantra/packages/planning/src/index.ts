export type PlanningScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type GoalArea =
  | "education"
  | "career"
  | "business"
  | "financial"
  | "personal-development"
  | "projects"
  | "family"
  | "community"
  | "other";

export type GoalStatus =
  | "draft"
  | "active"
  | "on-hold"
  | "completed"
  | "archived";

export type ProjectStatus =
  | "planned"
  | "active"
  | "blocked"
  | "completed"
  | "archived";

export type TaskStatus =
  | "todo"
  | "in-progress"
  | "blocked"
  | "done"
  | "cancelled";

export interface Goal {
  id: string;
  scope: PlanningScope;
  area: GoalArea;
  title: string;
  description?: string;
  status: GoalStatus;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  dueAt?: Date;
  completedAt?: Date;
}

export interface Project {
  id: string;
  goalId?: string;
  scope: PlanningScope;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeAccountId?: string;
  status: TaskStatus;
  dueAt?: Date;
  scheduledStartAt?: Date;
  scheduledEndAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDependency {
  taskId: string;
  dependsOnTaskId: string;
}

export interface GoalHierarchy {
  goal: Goal;
  projects: readonly Project[];
  tasks: readonly Task[];
}

export type PlanningBlockerReason =
  | "blocked-status"
  | "dependency-pending"
  | "overdue";

export interface PlanningBlocker {
  task: Task;
  reason: PlanningBlockerReason;
}

export interface AssigneeWorkload {
  assigneeAccountId: string;
  taskCount: number;
  blockedCount: number;
  overdueCount: number;
  nextDueAt?: Date;
}

function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [Date.now().toString(36), Math.random().toString(36).slice(2)].join("-");
}

export class PlanningWorkspace {
  private readonly goals = new Map<string, Goal>();
  private readonly milestones = new Map<string, Milestone>();
  private readonly projects = new Map<string, Project>();
  private readonly tasks = new Map<string, Task>();
  private readonly dependencies: TaskDependency[] = [];

  createGoal(input: Omit<Goal, "id" | "status" | "createdAt" | "updatedAt"> & { status?: GoalStatus }): Goal {
    const now = new Date();
    const goal: Goal = {
      id: createId(),
      scope: input.scope,
      area: input.area,
      title: input.title.trim(),
      description: input.description,
      status: input.status ?? "draft",
      targetDate: input.targetDate,
      createdAt: now,
      updatedAt: now,
    };

    this.goals.set(goal.id, goal);
    return goal;
  }

  activateGoal(goalId: string): Goal {
    const goal = this.requireGoal(goalId);
    goal.status = "active";
    goal.updatedAt = new Date();
    return goal;
  }

  createMilestone(input: Omit<Milestone, "id">): Milestone {
    this.requireGoal(input.goalId);
    const milestone: Milestone = {
      id: createId(),
      goalId: input.goalId,
      title: input.title.trim(),
      dueAt: input.dueAt,
      completedAt: input.completedAt,
    };
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  createProject(input: Omit<Project, "id" | "status" | "createdAt" | "updatedAt"> & { status?: ProjectStatus }): Project {
    if (input.goalId) {
      this.requireGoal(input.goalId);
    }

    const now = new Date();
    const project: Project = {
      id: createId(),
      goalId: input.goalId,
      scope: input.scope,
      name: input.name.trim(),
      description: input.description,
      status: input.status ?? "planned",
      deadline: input.deadline,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);
    return project;
  }

  createTask(input: Omit<Task, "id" | "status" | "createdAt" | "updatedAt"> & { status?: TaskStatus }): Task {
    this.requireProject(input.projectId);

    const now = new Date();
    const task: Task = {
      id: createId(),
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description,
      assigneeAccountId: input.assigneeAccountId,
      status: input.status ?? "todo",
      dueAt: input.dueAt,
      scheduledStartAt: input.scheduledStartAt,
      scheduledEndAt: input.scheduledEndAt,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  setTaskStatus(taskId: string, status: TaskStatus): Task {
    const task = this.requireTask(taskId);
    task.status = status;
    task.updatedAt = new Date();
    return task;
  }

  addDependency(taskId: string, dependsOnTaskId: string): TaskDependency {
    this.requireTask(taskId);
    this.requireTask(dependsOnTaskId);

    if (taskId === dependsOnTaskId) {
      throw new Error("Task cannot depend on itself.");
    }

    if (this.dependencies.some(item => item.taskId === taskId && item.dependsOnTaskId === dependsOnTaskId)) {
      throw new Error("Dependency already exists.");
    }

    if (this.createsDependencyCycle(taskId, dependsOnTaskId)) {
      throw new Error("Dependency would create a cycle.");
    }

    const dependency: TaskDependency = {
      taskId,
      dependsOnTaskId,
    };

    this.dependencies.push(dependency);
    return dependency;
  }

  progressForGoal(goalId: string): number {
    const projectIds = this.listProjectsByGoal(goalId).map(project => project.id);
    const tasks = this.listTasksByProjects(projectIds);

    if (tasks.length === 0) {
      return 0;
    }

    const done = tasks.filter(task => task.status === "done").length;
    return Math.round((done / tasks.length) * 100);
  }

  hierarchy(goalId: string): GoalHierarchy {
    const goal = this.requireGoal(goalId);
    const projects = this.listProjectsByGoal(goalId);
    const tasks = this.listTasksByProjects(projects.map(project => project.id));

    return {
      goal,
      projects,
      tasks,
    };
  }

  listGoals(scope: PlanningScope): readonly Goal[] {
    return [...this.goals.values()].filter(goal => this.sameScope(goal.scope, scope));
  }

  listProjectsByGoal(goalId: string): readonly Project[] {
    return [...this.projects.values()].filter(project => project.goalId === goalId);
  }

  listTasksByProject(projectId: string): readonly Task[] {
    return [...this.tasks.values()].filter(task => task.projectId === projectId);
  }

  listTasksByScope(scope: PlanningScope): readonly Task[] {
    return [...this.tasks.values()].filter(task => {
      const project = this.projects.get(task.projectId);
      if (!project) {
        return false;
      }

      return this.sameScope(project.scope, scope);
    });
  }

  blockers(scope: PlanningScope, now = new Date()): readonly PlanningBlocker[] {
    return this.listTasksByScope(scope)
      .map(task => ({ task, reason: this.blockerReason(task, now) }))
      .filter((entry): entry is { task: Task; reason: PlanningBlockerReason } => Boolean(entry.reason));
  }

  workload(scope: PlanningScope, now = new Date()): readonly AssigneeWorkload[] {
    const tasks = this.listTasksByScope(scope).filter(task => task.status !== "done" && task.status !== "cancelled");
    const workload = new Map<string, AssigneeWorkload>();

    for (const task of tasks) {
      const assigneeAccountId = task.assigneeAccountId ?? "unassigned";

      if (!workload.has(assigneeAccountId)) {
        workload.set(assigneeAccountId, {
          assigneeAccountId,
          taskCount: 0,
          blockedCount: 0,
          overdueCount: 0,
        });
      }

      const entry = workload.get(assigneeAccountId)!;
      const reason = this.blockerReason(task, now);

      entry.taskCount += 1;

      if (reason === "blocked-status" || reason === "dependency-pending") {
        entry.blockedCount += 1;
      }

      if (reason === "overdue") {
        entry.overdueCount += 1;
      }

      if (task.dueAt && (!entry.nextDueAt || task.dueAt < entry.nextDueAt)) {
        entry.nextDueAt = task.dueAt;
      }
    }

    return [...workload.values()].sort((a, b) => {
      if (b.overdueCount !== a.overdueCount) {
        return b.overdueCount - a.overdueCount;
      }

      if (b.blockedCount !== a.blockedCount) {
        return b.blockedCount - a.blockedCount;
      }

      return b.taskCount - a.taskCount;
    });
  }

  private listTasksByProjects(projectIds: readonly string[]): readonly Task[] {
    const lookup = new Set(projectIds);
    return [...this.tasks.values()].filter(task => lookup.has(task.projectId));
  }

  private blockerReason(task: Task, now: Date): PlanningBlockerReason | undefined {
    if (task.status === "done" || task.status === "cancelled") {
      return undefined;
    }

    if (task.status === "blocked") {
      return "blocked-status";
    }

    if (this.isDependencyPending(task.id)) {
      return "dependency-pending";
    }

    if (task.dueAt && task.dueAt < now) {
      return "overdue";
    }

    return undefined;
  }

  private isDependencyPending(taskId: string): boolean {
    const prerequisites = this.dependencies.filter(dep => dep.taskId === taskId);

    if (prerequisites.length === 0) {
      return false;
    }

    return prerequisites.some(dep => {
      const task = this.tasks.get(dep.dependsOnTaskId);
      return !task || task.status !== "done";
    });
  }

  private createsDependencyCycle(taskId: string, dependsOnTaskId: string): boolean {
    const adjacency = new Map<string, string[]>();

    for (const dependency of this.dependencies) {
      const list = adjacency.get(dependency.taskId) ?? [];
      list.push(dependency.dependsOnTaskId);
      adjacency.set(dependency.taskId, list);
    }

    const nextEdges = adjacency.get(taskId) ?? [];
    nextEdges.push(dependsOnTaskId);
    adjacency.set(taskId, nextEdges);

    const seen = new Set<string>();
    const queue: string[] = [dependsOnTaskId];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === taskId) {
        return true;
      }

      if (seen.has(current)) {
        continue;
      }

      seen.add(current);

      for (const next of adjacency.get(current) ?? []) {
        if (!seen.has(next)) {
          queue.push(next);
        }
      }
    }

    return false;
  }

  private sameScope(a: PlanningScope, b: PlanningScope): boolean {
    return a.ownerAccountId === b.ownerAccountId && a.organizationId === b.organizationId;
  }

  private requireGoal(goalId: string): Goal {
    const goal = this.goals.get(goalId);
    if (!goal) {
      throw new Error(`Goal '${goalId}' not found.`);
    }
    return goal;
  }

  private requireProject(projectId: string): Project {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project '${projectId}' not found.`);
    }
    return project;
  }

  private requireTask(taskId: string): Task {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task '${taskId}' not found.`);
    }
    return task;
  }
}
