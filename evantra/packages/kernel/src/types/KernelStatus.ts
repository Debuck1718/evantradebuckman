export interface KernelStatus {
  /**
   * Kernel version.
   */
  version: string;

  /**
   * Runtime state.
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
   * Registered workflows.
   */
  workflows: number;

  /**
   * Registered identities.
   */
  users: number;
}