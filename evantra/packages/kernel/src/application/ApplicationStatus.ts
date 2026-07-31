/**
 * Represents the lifecycle state
 * of an application hosted by
 * the Evantra Platform.
 */
export enum ApplicationStatus {
  /**
   * Registered with the platform
   * but not yet initialized.
   */
  REGISTERED = "REGISTERED",

  /**
   * Application is preparing
   * required resources.
   */
  INITIALIZING = "INITIALIZING",

  /**
   * Application is actively running.
   */
  RUNNING = "RUNNING",

  /**
   * Application is stopping.
   */
  STOPPING = "STOPPING",

  /**
   * Application has stopped.
   */
  STOPPED = "STOPPED",

  /**
   * Startup failed.
   */
  FAILED = "FAILED",

  /**
   * Removed from the platform.
   */
  UNLOADED = "UNLOADED",
}