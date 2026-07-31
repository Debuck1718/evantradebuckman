import { Clock } from "../../src/platform/Clock";

/**
 * Uses the system clock.
 */
export class SystemClock
  implements Clock {

  /**
   * Returns the current time.
   */
  now(): Date {
    return new Date();
  }

  /**
   * Returns a future time.
   */
  afterMinutes(
    minutes: number
  ): Date {

    return new Date(
      Date.now() + minutes * 60_000
    );
  }

}