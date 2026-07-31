import { EntityStatus } from "../state/EntityStatus";

/**
 * Represents an entity managed by the kernel.
 *
 * Every entity has:
 * - an operational status (ACTIVE, ARCHIVED, etc.)
 * - an optional workflow state managed by the State Engine
 */
export interface Entity {
  /**
   * Unique entity identifier.
   */
  id: string;

  /**
   * Entity type.
   *
   * Examples:
   * User
   * Order
   * Assignment
   * Report
   */
  type: string;

  /**
   * Operational status.
   */
  status: EntityStatus;

  /**
   * Business workflow state.
   *
   * Examples:
   * Pending
   * Paid
   * Packed
   * Delivered
   */
  workflowState?: string;

  /**
   * Arbitrary application metadata.
   */
  metadata?: Record<string, unknown>;
}