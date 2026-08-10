export interface EvantraRequestOptions {
  accessToken?: string;
  organizationId?: string;
  headers?: Record<string, string>;
}

export interface PaginatedResult<T> {
  items: readonly T[];
  nextCursor?: string;
}

export interface WorkspaceAccount {
  id: string;
  evantraId: string;
  firstName: string;
  lastName: string;
}

export type BurdenBand = "low" | "moderate" | "high" | "critical";

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
  ownerAccountId: string;
  dueAt: string;
  status: PromiseStatus;
}

export interface LifeWorkPlan {
  generatedAt: string;
  burden: BurdenAssessment;
  topFocus: readonly string[];
  promisesDueSoon: readonly WorkspacePromise[];
  guardrails: readonly string[];
}

export interface WorkspaceClient {
  getCurrentAccount(options?: EvantraRequestOptions): Promise<WorkspaceAccount>;
  getBurdenAssessment(options?: EvantraRequestOptions): Promise<BurdenAssessment>;
  listPromises(options?: EvantraRequestOptions): Promise<readonly WorkspacePromise[]>;
  getLifeWorkPlan(options?: EvantraRequestOptions): Promise<LifeWorkPlan>;
}
