import { z } from "zod";

export const assistantRequestSchema = z.object({
  threadId: z.string().uuid().optional(),
  intent: z.enum(["weekly-priorities", "project-status", "goal-risk", "context-collection", "deadline-focus"]),
  question: z.string().trim().min(1).max(2000),
});

export const knowledgeRequestSchema = z.object({
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1).max(100000),
  type: z.enum(["note", "idea", "research", "bookmark", "reflection", "document"]).default("note"),
  tags: z.array(z.string().trim().min(1).max(64)).max(30).default([]),
  relatedId: z.string().uuid().optional(),
});

export const calendarRequestSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional(),
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
  focusBlock: z.boolean().default(false),
});

export const financeRequestSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().finite().positive().max(1_000_000_000),
  currency: z.string().trim().regex(/^[A-Z]{3}$/).default("USD"),
  category: z.string().trim().min(1).max(64),
  note: z.string().trim().max(5000).optional(),
});

export const promisePatchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["proposed", "active", "fulfilled", "renegotiated", "breached", "cancelled"]),
});

export const promiseCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  dueAt: z.string().datetime({ offset: true }),
});

export const burdenSchema = z.object({
  snapshot: z.object({
    openTasks: z.number().int().nonnegative().max(100000),
    blockedTasks: z.number().int().nonnegative().max(100000),
    overdueTasks: z.number().int().nonnegative().max(100000),
    meetingsMinutesToday: z.number().int().nonnegative().max(1440),
    focusMinutesToday: z.number().int().nonnegative().max(1440),
    recoveryMinutesToday: z.number().int().nonnegative().max(1440),
    commitmentsDueSoon: z.number().int().nonnegative().max(100000),
  }),
});

/*
 * Vault request. The category list is validated again in the
 * route against the DB's own vocabulary so a new enum value here
 * cannot silently insert a category the schema rejects.
 */
export const vaultRequestSchema = z.object({
  category: z.enum([
    "certificate",
    "cv",
    "id-record",
    "contract",
    "receipt",
    "project-doc",
    "academic-record",
    "business-doc",
    "other",
  ]),
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1).max(200000),
  tags: z.array(z.string().trim().min(1).max(64)).max(30).default([]),
});

/*
 * Security-alert email preferences. All three are explicit booleans
 * rather than optional, so a partial update cannot silently leave a
 * field at its previous value while the UI shows it changed.
 */
export const notificationPreferencesSchema = z.object({
  securityEmailEnabled: z.boolean(),
  newDeviceEmail: z.boolean(),
  appAuthorizedEmail: z.boolean(),
});
