/**
 * Options for scheduling a command.
 *
 * Only one scheduling strategy should
 * be specified per task.
 */
export interface ScheduleOptions {
  /**
   * Execute after a delay (milliseconds).
   */
  after?: number;

  /**
   * Execute at an exact date/time.
   */
  at?: Date;

  /**
   * Repeat execution every interval
   * (milliseconds).
   */
  every?: number;
}