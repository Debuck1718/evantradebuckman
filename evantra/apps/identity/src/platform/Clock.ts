/**
 * Represents the current time
 * for the Identity platform.
 */
export interface Clock {

  /**
   * Returns the current date and time.
   */
  now(): Date;

  /**
   * Returns a future time.
   */
  afterMinutes(
    minutes: number
  ): Date;
}