import { Command } from "../command/Command";
import { createId } from "../utils/createId";

import {
  ScheduledTask,
  ScheduleOptions,
} from "./index";

/**
 * Executes commands in the future.
 */
export class Scheduler {
  private readonly tasks =
    new Map<string, ScheduledTask>();

  constructor(
    private readonly executor: (
      command: Command
    ) => Promise<void>
  ) {}

  /**
   * Schedule a command.
   */
  async schedule<T extends Command>(
    command: T,
    options: ScheduleOptions
  ): Promise<string> {
    this.validate(options);

    const id = createId();

    const execute = async () => {
      await this.executor(command);

      if (!options.every) {
        this.tasks.delete(id);
      }
    };

    const delay =
      options.after ??
      (options.at
        ? Math.max(
            0,
            options.at.getTime() - Date.now()
          )
        : 0);

    const timer = options.every
      ? setInterval(execute, options.every)
      : setTimeout(execute, delay);

    const task: ScheduledTask = {
      id,
      command,
      options,
      createdAt: new Date(),
      timer,

      cancel: () => {
        if (options.every) {
          clearInterval(timer);
        } else {
          clearTimeout(timer);
        }

        this.tasks.delete(id);
      },
    };

    this.tasks.set(id, task);

    return id;
  }

  /**
   * Cancel a scheduled task.
   */
  cancel(id: string): boolean {
    const task = this.tasks.get(id);

    if (!task) {
      return false;
    }

    task.cancel();

    return true;
  }

  /**
   * Cancel every scheduled task.
   */
  cancelAll(): void {
    for (const task of this.tasks.values()) {
      task.cancel();
    }
  }

  /**
   * Returns a scheduled task.
   */
  get(
    id: string
  ): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  /**
   * Returns true if the task exists.
   */
  has(id: string): boolean {
    return this.tasks.has(id);
  }

  /**
   * Returns every scheduled task.
   */
  list(): readonly ScheduledTask[] {
    return [...this.tasks.values()];
  }

  /**
   * Returns the number of tasks.
   */
  count(): number {
    return this.tasks.size;
  }

  /**
   * Clears every task.
   */
  clear(): void {
    this.cancelAll();
  }

  /**
   * Validates scheduling options.
   */
  private validate(
    options: ScheduleOptions
  ): void {
    const strategies = [
      options.after !== undefined,
      options.at !== undefined,
      options.every !== undefined,
    ].filter(Boolean);

    if (strategies.length !== 1) {
      throw new Error(
        "Exactly one scheduling strategy must be specified."
      );
    }
  }
}