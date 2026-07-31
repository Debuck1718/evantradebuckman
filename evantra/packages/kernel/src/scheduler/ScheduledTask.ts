import { Command } from "../command/Command";
import { ScheduleOptions } from "./ScheduleOptions";

/**
 * Timer handle that works across
 * browsers, Node.js, Bun and Deno.
 */
export type TimerHandle =
  ReturnType<typeof setTimeout>;

/**
 * Represents a scheduled command.
 */
export interface ScheduledTask<
  T extends Command = Command
> {
  /**
   * Unique task identifier.
   */
  id: string;

  /**
   * Command to execute.
   */
  command: T;

  /**
   * Scheduling configuration.
   */
  options: ScheduleOptions;

  /**
   * Creation timestamp.
   */
  createdAt: Date;

  /**
   * Runtime timer reference.
   */
  timer: TimerHandle;

  /**
   * Cancels the task.
   */
  cancel(): void;
}