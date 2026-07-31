import { Command } from "../command/Command";

import { Kernel } from "../core/Kernel";
import { ServiceContainer } from "../core/ServiceContainer";

import { EntityRegistry } from "../entity/EntityRegistry";

import { Event } from "../event/Event";
import { EventBus } from "../event/EventBus";

import {
  ScheduleOptions,
  Scheduler,
} from "../scheduler";

import { StateEngine } from "../state/StateEngine";
import { TransitionHistory } from "../state/history/TransitionHistory";

import { KernelStatus } from "../types/KernelStatus";

import { WorkflowRegistry } from "../workflow";

import { ApplicationManager } from "./ApplicationManager";

/**
 * Context supplied to every
 * Evantra application.
 *
 * Applications interact with the
 * Kernel through this context
 * instead of accessing the Kernel
 * directly.
 */
export class ApplicationContext {
  constructor(
    private readonly kernel: Kernel
  ) {}

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

  /**
   * Returns the current
   * Kernel status.
   */
  status(): KernelStatus {
    return this.kernel.status();
  }

  /**
   * Entity registry.
   */
  get entities(): EntityRegistry {
    return this.kernel.entities;
  }

  /**
   * Event bus.
   */
  get events(): EventBus {
    return this.kernel.events;
  }

  /**
   * Workflow registry.
   */
  get workflows(): WorkflowRegistry {
    return this.kernel.workflows;
  }

  /**
   * State engine.
   */
  get states(): StateEngine {
    return this.kernel.states;
  }

  /**
   * Scheduler.
   */
  get scheduler(): Scheduler {
    return this.kernel.scheduler;
  }

  /**
   * Transition history.
   */
  get history(): TransitionHistory {
    return this.kernel.history;
  }

  /**
   * Registered applications.
   */
  get applications(): ApplicationManager {
    return this.kernel.applications;
  }

  /**
   * Shared service container.
   */
  get services(): ServiceContainer {
    return this.kernel.services;
  }
}