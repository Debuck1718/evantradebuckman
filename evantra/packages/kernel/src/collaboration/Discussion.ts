/**
 * Represents a discussion thread inside an organization —
 * the shared space where members exchange ideas, ask
 * questions and make decisions together.
 */
import { DiscussionStatus, DiscussionVisibility } from "./DiscussionStatus";

export interface Discussion {
  /** Unique discussion identifier. */
  readonly id: string;

  /** Organization the discussion belongs to. */
  readonly organizationId: string;

  /** Account that created the discussion. */
  readonly authorId: string;

  /** Short title of the thread. */
  title: string;

  /** Opening message / body. */
  body: string;

  /** Who can see the thread. */
  visibility: DiscussionVisibility;

  /** Lifecycle state. */
  status: DiscussionStatus;

  /** Optional pinned status for important threads. */
  pinned: boolean;

  /** Creation timestamp (ISO 8601). */
  readonly createdAt: string;

  /** Last update timestamp (ISO 8601). */
  updatedAt: string;
}

/**
 * A single reply inside a discussion thread.
 */
export interface DiscussionReply {
  readonly id: string;
  readonly discussionId: string;
  readonly authorId: string;
  body: string;
  readonly createdAt: string;
  updatedAt: string;
}
