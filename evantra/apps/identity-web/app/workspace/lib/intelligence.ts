export type BurdenBand = "low" | "moderate" | "high" | "critical";

export interface BurdenSnapshot {
  openTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  meetingsMinutesToday: number;
  focusMinutesToday: number;
  recoveryMinutesToday: number;
  commitmentsDueSoon: number;
}

export interface BurdenAssessment {
  score: number;
  band: BurdenBand;
  reasons: readonly string[];
  recommendations: readonly string[];
}

export type PromiseStatus =
  | "proposed"
  | "active"
  | "fulfilled"
  | "renegotiated"
  | "breached"
  | "cancelled";

export interface WorkspacePromise {
  id: string;
  title: string;
  dueAt: string;
  status: PromiseStatus;
  createdAt: string;
}

export interface LifeWorkPlan {
  generatedAt: string;
  burden: BurdenAssessment;
  topFocus: readonly string[];
  promisesDueSoon: readonly WorkspacePromise[];
  guardrails: readonly string[];
}

const BURDEN_KEY = "evantra_workspace_burden";
const PROMISES_KEY = "evantra_workspace_promises";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const defaultBurdenSnapshot: BurdenSnapshot = {
  openTasks: 8,
  blockedTasks: 1,
  overdueTasks: 1,
  meetingsMinutesToday: 120,
  focusMinutesToday: 120,
  recoveryMinutesToday: 60,
  commitmentsDueSoon: 1,
};

export function assessBurden(snapshot: BurdenSnapshot): BurdenAssessment {
  const overloadSignals =
    snapshot.blockedTasks * 7 +
    snapshot.overdueTasks * 9 +
    snapshot.commitmentsDueSoon * 6 +
    Math.max(snapshot.openTasks - 8, 0) * 2;

  const meetingLoad = Math.floor(snapshot.meetingsMinutesToday / 45) * 4;
  const focusDebt = Math.max(180 - snapshot.focusMinutesToday, 0) / 15;
  const recoveryDebt = Math.max(90 - snapshot.recoveryMinutesToday, 0) / 10;

  const score = clamp(Math.round(overloadSignals + meetingLoad + focusDebt + recoveryDebt), 0, 100);

  const reasons: string[] = [];

  if (snapshot.blockedTasks > 0) {
    reasons.push(`${snapshot.blockedTasks} blocked task(s)`);
  }

  if (snapshot.overdueTasks > 0) {
    reasons.push(`${snapshot.overdueTasks} overdue task(s)`);
  }

  if (snapshot.commitmentsDueSoon > 0) {
    reasons.push(`${snapshot.commitmentsDueSoon} commitment(s) due soon`);
  }

  if (snapshot.focusMinutesToday < 180) {
    reasons.push("low deep-focus time");
  }

  if (snapshot.recoveryMinutesToday < 90) {
    reasons.push("insufficient recovery time");
  }

  const band: BurdenBand =
    score >= 80
      ? "critical"
      : score >= 60
      ? "high"
      : score >= 35
      ? "moderate"
      : "low";

  const recommendations = recommendationsForBand(band);

  return {
    score,
    band,
    reasons,
    recommendations,
  };
}

function recommendationsForBand(band: BurdenBand): readonly string[] {
  if (band === "critical") {
    return [
      "Freeze new intake and renegotiate non-critical commitments.",
      "Protect a 90-minute deep-work block immediately.",
      "Escalate blockers and clear at least one today.",
    ];
  }

  if (band === "high") {
    return [
      "Defer low-priority meetings.",
      "Delegate or close two active tasks.",
      "Reserve a recovery window before end of day.",
    ];
  }

  if (band === "moderate") {
    return [
      "Keep active queue small and protect focus blocks.",
      "Resolve one blocker before accepting new urgent work.",
    ];
  }

  return ["Current load is sustainable. Keep focus and recovery balanced."];
}

export function loadBurdenSnapshot(): BurdenSnapshot {
  if (typeof window === "undefined") {
    return defaultBurdenSnapshot;
  }

  try {
    const raw = window.localStorage.getItem(BURDEN_KEY);
    if (!raw) {
      return defaultBurdenSnapshot;
    }

    const parsed = JSON.parse(raw) as BurdenSnapshot;

    return {
      openTasks: Number(parsed.openTasks ?? defaultBurdenSnapshot.openTasks),
      blockedTasks: Number(parsed.blockedTasks ?? defaultBurdenSnapshot.blockedTasks),
      overdueTasks: Number(parsed.overdueTasks ?? defaultBurdenSnapshot.overdueTasks),
      meetingsMinutesToday: Number(parsed.meetingsMinutesToday ?? defaultBurdenSnapshot.meetingsMinutesToday),
      focusMinutesToday: Number(parsed.focusMinutesToday ?? defaultBurdenSnapshot.focusMinutesToday),
      recoveryMinutesToday: Number(parsed.recoveryMinutesToday ?? defaultBurdenSnapshot.recoveryMinutesToday),
      commitmentsDueSoon: Number(parsed.commitmentsDueSoon ?? defaultBurdenSnapshot.commitmentsDueSoon),
    };
  } catch {
    return defaultBurdenSnapshot;
  }
}

export function saveBurdenSnapshot(snapshot: BurdenSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BURDEN_KEY, JSON.stringify(snapshot));
}

export function loadPromises(): WorkspacePromise[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PROMISES_KEY);
    return raw ? (JSON.parse(raw) as WorkspacePromise[]) : [];
  } catch {
    return [];
  }
}

export function savePromises(promises: readonly WorkspacePromise[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROMISES_KEY, JSON.stringify(promises));
}

export function createPromise(title: string, dueAt: string): WorkspacePromise {
  const now = new Date().toISOString();

  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: title.trim(),
    dueAt,
    status: "proposed",
    createdAt: now,
  };
}

export function transitionPromise(item: WorkspacePromise, status: PromiseStatus): WorkspacePromise {
  return {
    ...item,
    status,
  };
}

export function dueSoonPromises(promises: readonly WorkspacePromise[], horizonHours = 72, now = new Date()): readonly WorkspacePromise[] {
  const end = new Date(now.getTime() + horizonHours * 60 * 60 * 1000);

  return promises.filter(item => {
    if (item.status === "fulfilled" || item.status === "cancelled") {
      return false;
    }

    const due = new Date(item.dueAt);
    return due >= now && due <= end;
  });
}

export function buildLifeWorkPlan(input: {
  burden: BurdenSnapshot;
  promises: readonly WorkspacePromise[];
  topTasks: readonly string[];
  upcomingEventsCount: number;
}): LifeWorkPlan {
  const burden = assessBurden(input.burden);
  const promisesDueSoon = dueSoonPromises(input.promises);

  const guardrails = [
    ...burden.recommendations,
    promisesDueSoon.length > 0
      ? `You have ${promisesDueSoon.length} commitment(s) due in the next 72 hours.`
      : "No urgent commitments due in the next 72 hours.",
    input.upcomingEventsCount > 6
      ? "Meeting load is high. Protect one deep-work block."
      : "Meeting load is manageable for focused execution.",
  ];

  return {
    generatedAt: new Date().toISOString(),
    burden,
    topFocus: input.topTasks.slice(0, 5),
    promisesDueSoon,
    guardrails,
  };
}
