export type BurdenScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type BurdenBand = "low" | "moderate" | "high" | "critical";

export interface BurdenSnapshot {
  scope: BurdenScope;
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class BurdenEngine {
  assess(snapshot: BurdenSnapshot): BurdenAssessment {
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
      reasons.push(`${snapshot.commitmentsDueSoon} promise(s) due soon`);
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

    const recommendations = this.recommendationsForBand(band, snapshot);

    return {
      score,
      band,
      reasons,
      recommendations,
    };
  }

  private recommendationsForBand(
    band: BurdenBand,
    snapshot: BurdenSnapshot,
  ): readonly string[] {
    if (band === "critical") {
      return [
        "Freeze new intake for today and renegotiate non-critical commitments.",
        "Schedule a protected 90-minute focus block immediately.",
        "Escalate blocked tasks to owners and remove at least one blocker.",
      ];
    }

    if (band === "high") {
      return [
        "Reduce meeting load by deferring low-priority sessions.",
        "Close or delegate at least two open tasks.",
        "Reserve a recovery window before end of day.",
      ];
    }

    if (band === "moderate") {
      return [
        "Protect at least one uninterrupted deep-work block.",
        "Resolve one blocker before adding new work.",
      ];
    }

    if (snapshot.openTasks > 10) {
      return ["Keep active queue under 10 items to avoid context fragmentation."];
    }

    return ["Current load is sustainable. Keep focus and recovery balance."];
  }
}
