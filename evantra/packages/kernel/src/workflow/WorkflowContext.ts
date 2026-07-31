import { Kernel } from "../core/Kernel";

import { Command } from "../command/Command";

import { Event } from "../event/Event";
import { EventContext } from "../event/EventContext";

import {
  ScheduleOptions,
} from "../scheduler";

/**
 * Context supplied to every
 * workflow execution.
 */
export class WorkflowContext {
  constructor(
    private readonly kernel: Kernel,
    private readonly eventContext: EventContext<Event>
  ) {}

  /**
   * Event that triggered
   * the workflow.
   */
  get event(): Event {
    return this.eventContext.event;
  }

  /**
   * Original event context.
   */
  get context(): EventContext<Event> {
    return this.eventContext;
  }

  /**
   * Executes a command.
   */
  async execute<T extends Command>(
    command: T
  ): Promise<void> {
    await this.kernel.execute(command);
  }

  /**
   * Publishes an event.
   */
  async publish<T extends Event>(
    event: T
  ): Promise<void> {
    await this.kernel.events.publish(event);
  }

  /**
   * Schedules a command.
   */
  async schedule<T extends Command>(
    command: T,
    options: ScheduleOptions
  ): Promise<string> {
    return this.kernel.schedule(
      command,
      options
    );
  }

  /**
   * Executes a workflow
   * state transition.
   */
  async transition(
    entityId: string,
    action: string
  ): Promise<void> {
    await this.kernel.states.transition(
      entityId,
      action
    );
  }
}