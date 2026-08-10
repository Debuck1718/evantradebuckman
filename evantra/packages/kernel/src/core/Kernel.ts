import { Runtime } from "./Runtime";
import { ServiceContainer } from "./ServiceContainer";

import { Command } from "../command/Command";
import { CommandBus } from "../command/CommandBus";
import { CreateEntityHandler } from "../command/handlers/CreateEntityHandler";

import { EntityRegistry } from "../entity/EntityRegistry";

import { EventBus } from "../event/EventBus";
import { AuditSubscriber } from "../event/subscribers/AuditSubscriber";

import {
  ExecutionContext,
  ExecutionPipeline,
  LoggingStep,
  PipelineStep,
} from "../pipeline";

import {
  Scheduler,
  ScheduleOptions,
} from "../scheduler";

import {
  KernelStatus,
} from "../types/KernelStatus";

import {
  StateEngine,
} from "../state/StateEngine";

import {
  TransitionHistory,
} from "../state/history/TransitionHistory";

import {
  ApplicationContext,
  ApplicationManager,
  ApplicationRegistry,
} from "../application";

import {
  OrganizationManager,
  OrganizationRegistry,
} from "../organization";

import {
  WorkflowEngine,
  WorkflowRegistry,
} from "../workflow";

import {
  BurdenEngine,
  LifeWorkOrchestrator,
  PromiseGraph,
} from "../intelligence";

/**
 * Evantra Kernel
 *
 * The Kernel coordinates every
 * subsystem shared across the
 * Evantra ecosystem.
 *
 * It intentionally contains no
 * Identity implementation.
 */
export class Kernel {

  /**
   * Current kernel version.
   */
  public static readonly VERSION =
    "0.1.0";

  /**
   * Runtime.
   */
  private readonly runtime =
    new Runtime();

  /**
   * Dependency container.
   */
  public readonly services =
    new ServiceContainer();

  /**
   * Execution pipeline.
   */
  public readonly pipeline =
    new ExecutionPipeline();

  constructor() {

    this.registerCoreServices();

    this.registerHandlers();

    this.registerSubscribers();

    this.registerPipeline();

    this.runtime.start();

  }

  /**
   * Executes a command.
   */
  async execute<T extends Command>(
    request: T,
  ): Promise<void> {

    const context =
      new ExecutionContext(
        request,
      );

    await this.pipeline.execute(

      context,

      async () => {

        await this.services
          .resolve(CommandBus)
          .execute(context);

      },

    );

  }

  /**
   * Schedules a command.
   */
  async schedule<T extends Command>(
    command: T,
    options: ScheduleOptions,
  ): Promise<string> {

    return this.scheduler.schedule(

      command,

      options,

    );

  }

  /**
   * Registers an additional
   * pipeline step.
   */
  use(
    step: PipelineStep,
  ): this {

    this.pipeline.use(
      step,
    );

    return this;

  }

  /**
   * Entity Registry.
   */
  get entities(): EntityRegistry {

    return this.services.resolve(

      EntityRegistry,

    );

  }

  /**
   * Event Bus.
   */
  get events(): EventBus {

    return this.services.resolve(

      EventBus,

    );

  }

  /**
   * Scheduler.
   */
  get scheduler(): Scheduler {

    return this.services.resolve(

      Scheduler,

    );

  }

  /**
   * State Engine.
   */
  get states(): StateEngine {

    return this.services.resolve(

      StateEngine,

    );

  }

  /**
   * Transition History.
   */
  get history(): TransitionHistory {

    return this.services.resolve(

      TransitionHistory,

    );

  }

  /**
   * Application Runtime.
   */
  get applications(): ApplicationManager {

    return this.services.resolve(

      ApplicationManager,

    );

  }

  /**
   * Organization Runtime.
   */
  get organizations(): OrganizationManager {

    return this.services.resolve(

      OrganizationManager,

    );

  }

  /**
   * Workflow Registry.
   */
  get workflows(): WorkflowRegistry {

    return this.services.resolve(

      WorkflowRegistry,

    );

  }

  /**
   * Burden intelligence runtime.
   */
  get burden(): BurdenEngine {

    return this.services.resolve(

      BurdenEngine,

    );

  }

  /**
   * Promise and accountability runtime.
   */
  get promises(): PromiseGraph {

    return this.services.resolve(

      PromiseGraph,

    );

  }

  /**
   * Unified life-work orchestration runtime.
   */
  get lifeWork(): LifeWorkOrchestrator {

    return this.services.resolve(

      LifeWorkOrchestrator,

    );

  }

  /**
   * Returns the current
   * kernel status.
   */
  status(): KernelStatus {

    return {

      version:

        Kernel.VERSION,

      running:

        this.runtime.isRunning(),

      services:

        this.services.size,

      entities:

        this.entities.count(),

      events:

        this.events.count(),

      scheduled:

        this.scheduler.count(),

      stateMachines:

        this.states.count(),

      applications:

        this.applications.count(),

      organizations:

        this.organizations.countOrganizations(),

      workflows:

        this.workflows.count(),

      promises:

        this.promises.count(),

    };

  }

  /**
   * Stops the runtime.
   */
  stop(): void {

    this.runtime.stop();

  }

  // ------------------------------------------------------------------
  // Part 2 starts here
  // ------------------------------------------------------------------
    /**
   * Registers every core subsystem.
   */
  private registerCoreServices(): void {
  this.registerEventServices();

  this.registerEntityServices();

  this.registerCommandServices();

  this.registerSchedulerServices();

  this.registerStateServices();

  this.registerApplicationServices();

  this.registerOrganizationServices();

  this.registerIntelligenceServices();

  this.registerWorkflowServices();

}

  /**
   * Registers event services.
   */
  private registerEventServices(): void {

    const eventBus =
      new EventBus();

    this.services.register(
      EventBus,
      eventBus
    );
  }

  /**
   * Registers entity services.
   */
  private registerEntityServices(): void {

    const entityRegistry =
      new EntityRegistry(
        this.events
      );

    this.services.register(
      EntityRegistry,
      entityRegistry
    );
  }

  /**
   * Registers command services.
   */
  private registerCommandServices(): void {

    const commandBus =
      new CommandBus();

    this.services.register(
      CommandBus,
      commandBus
    );
  }

  /**
   * Registers scheduler services.
   */
  private registerSchedulerServices(): void {

    const scheduler =
      new Scheduler(
        async command => {
          await this.execute(command);
        }
      );

    this.services.register(
      Scheduler,
      scheduler
    );
  }

  /**
   * Registers state services.
   */
  private registerStateServices(): void {

    const history =
      new TransitionHistory();

    this.services.register(
      TransitionHistory,
      history
    );

    const engine =
      new StateEngine(
        this.entities,
        this.events,
        history
      );

    this.services.register(
      StateEngine,
      engine
    );
  }

  /**
   * Registers application services.
   */
  private registerApplicationServices(): void {

    const registry =
      new ApplicationRegistry();

    const context =
      new ApplicationContext(
        this
      );

      this.services.register(
  ApplicationContext,
  context
);

    const manager =
      new ApplicationManager(
        registry,
        context
      );

    this.services.register(
      ApplicationRegistry,
      registry
    );

    this.services.register(
      ApplicationManager,
      manager
    );
  }

  /**
   * Registers organization services.
   */
  private registerOrganizationServices(): void {

    const organizationRegistry =
      new OrganizationRegistry();

    this.services.register(
      OrganizationRegistry,
      organizationRegistry,
    );

    const organizationManager =
      new OrganizationManager(
        organizationRegistry,
      );

    this.services.register(
      OrganizationManager,
      organizationManager,
    );

  }

  /**
   * Registers intelligence services.
   */
  private registerIntelligenceServices(): void {
    const burdenEngine =
      new BurdenEngine();

    this.services.register(
      BurdenEngine,
      burdenEngine,
    );

    const promiseGraph =
      new PromiseGraph();

    this.services.register(
      PromiseGraph,
      promiseGraph,
    );

    const lifeWork =
      new LifeWorkOrchestrator(
        burdenEngine,
        promiseGraph,
      );

    this.services.register(
      LifeWorkOrchestrator,
      lifeWork,
    );
  }

  /**
   * Registers workflow services.
   */
  private registerWorkflowServices(): void {

  const registry =
    new WorkflowRegistry();

  this.services.register(
    WorkflowRegistry,
    registry
  );

  const engine =
    new WorkflowEngine(
      this,
      registry
    );

  this.services.register(
    WorkflowEngine,
    engine
  );
}


  // ------------------------------------------------------------------
  // Part 3 starts here
  // ------------------------------------------------------------------
    /**
   * Registers command handlers.
   */
  private registerHandlers(): void {

    const commandBus =
      this.services.resolve(
        CommandBus
      );

    commandBus.register(
      new CreateEntityHandler(
        this.entities
      )
    );
  }

  /**
   * Registers event subscribers.
   */
  private registerSubscribers(): void {

  this.events.subscribe(
    new AuditSubscriber()
  );

  this.events.subscribe(
    this.services.resolve(
      WorkflowEngine
    )
  );
}

  /**
   * Registers default pipeline
   * behavior.
   */
  private registerPipeline(): void {

    this.use(
      new LoggingStep()
    );
  }
}