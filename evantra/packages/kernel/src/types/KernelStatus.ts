/**
 * Represents the current
 * runtime status of the
 * Evantra Kernel.
 */
export interface KernelStatus {

  /**
   * Kernel version.
   */
  version: string;

  /**
   * Indicates whether the
   * runtime is active.
   */
  running: boolean;

  /**
   * Registered services.
   */
  services: number;

  /**
   * Registered entities.
   */
  entities: number;

  /**
   * Published events.
   */
  events: number;

  /**
   * Scheduled tasks.
   */
  scheduled: number;

  /**
   * Registered state machines.
   */
  stateMachines: number;

  /**
   * Registered applications.
   */
  applications: number;

  /**
   * Registered organizations.
   */
  organizations: number;

  /**
   * Registered workflows.
   */
  workflows: number;

  /**
   * Tracked commitments/promises.
   */
  promises: number;

}