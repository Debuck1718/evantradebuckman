import { z } from "zod";

export const supportCreateSchema = z.object({
  category: z.enum(["bug", "account", "billing", "feature", "other"]),
  subject: z.string().trim().min(3).max(255),
  message: z.string().trim().min(10).max(20000),
  contactEmail: z.string().trim().email().max(320),
});

export const organizationCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
});

export const inviteCreateSchema = z.object({
  organizationId: z.string().uuid(),
  evantraId: z.string().trim().min(2).max(64),
});

export const inviteRespondSchema = z.object({
  inviteId: z.string().uuid(),
  accept: z.boolean(),
});

export const supportResolveSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["IN_REVIEW", "RESOLVED", "DISMISSED"]),
  adminReply: z.string().trim().max(10000).optional(),
});

export const notificationsReadSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
});
