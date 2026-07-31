import { WorkflowActivity } from "./WorkflowActivity";

/**
 * Represents a business workflow
 * executed by the Evantra Kernel.
 *
 * A workflow listens for a specific
 * event and executes one or more
 * activities when that event occurs.
 */
export interface Workflow {
  /**
   * Unique workflow identifier.
   *
   * Example:
   * storeforge.order.paid
   */
  readonly id: string;

  /**
   * Human-readable workflow name.
   */
  readonly name: string;

  /**
   * Event that triggers
   * this workflow.
   *
   * Example:
   * EntityCreated
   * StateTransitioned
   */
  readonly event: string;

  /**
   * Determines whether this
   * workflow is active.
   */
  readonly enabled: boolean;

  /**
   * Activities executed
   * in order.
   */
  readonly activities:
    readonly WorkflowActivity[];
}