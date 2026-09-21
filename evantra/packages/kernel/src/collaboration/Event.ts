/**
 * An organization event — meeting, workshop,
 * all-hands — scheduled at a specific time
 * with an optional virtual meeting link.
 */
export interface OrganizationEvent {
  readonly id: string;
  readonly organizationId: string;
  readonly creatorId: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  meetingUrl: string | null;
  status: EventStatusEnum;
  readonly createdAt: string;
  updatedAt: string;
}

import { EventStatus as EventStatusEnum } from "./EventStatus";
