export type CalendarVisibility =
  | "private"
  | "organization"
  | "public";

export interface Calendar {
  id: string;
  ownerAccountId: string;
  organizationId?: string;
  name: string;
  timezone: string;
  visibility: CalendarVisibility;
  createdAt: Date;
  updatedAt: Date;
}
