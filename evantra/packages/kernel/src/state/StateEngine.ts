import { Entity } from "../entity/Entity";
import { EntityRegistry } from "../entity/EntityRegistry";

import { EventBus } from "../event/EventBus";

import { StateMachine } from "./StateMachine";

import { TransitionHistory } from "./history/TransitionHistory";
import { StateTransitionEvent } from "../event/StateTransitionEvent";

/**
 * Coordinates workflow state transitions
 * for every registered entity.
 */
export class StateEngine {
  /**
   * Registered machines.
   *
   * Key = Entity Type
   */
  private readonly machines =
    new Map<string, StateMachine>();

  constructor(
    private readonly entities: EntityRegistry,
    private readonly events: EventBus,
    private readonly history: TransitionHistory
  ) {}

  /**
   * Registers a machine.
   */
  register(
    entityType: string,
    machine: StateMachine
  ): void {
    if (this.machines.has(entityType)) {
      throw new Error(
        `State machine '${entityType}' is already registered.`
      );
    }

    this.machines.set(entityType, machine);
  }

  /**
   * Returns a machine.
   */
  get(
    entityType: string
  ): StateMachine | undefined {
    return this.machines.get(entityType);
  }

  /**
   * Returns true if a machine exists.
   */
  has(entityType: string): boolean {
    return this.machines.has(entityType);
  }

  /**
   * Every registered machine.
   */
  all(): readonly StateMachine[] {
    return [...this.machines.values()];
  }

  /**
   * Number of machines.
   */
  count(): number {
    return this.machines.size;
  }

  /**
   * Removes one machine.
   */
  unregister(
    entityType: string
  ): boolean {
    return this.machines.delete(entityType);
  }

  /**
   * Removes every machine.
   */
  clear(): void {
    this.machines.clear();
  }

  /**
   * Executes a workflow transition.
   */
  async transition(
    entityId: string,
    action: string
  ): Promise<Entity> {

    const entity =
      this.entities.get(entityId);

    if (!entity) {
      throw new Error(
        `Entity '${entityId}' not found.`
      );
    }

    const machine =
      this.machines.get(entity.type);

    if (!machine) {
      throw new Error(
        `No state machine registered for '${entity.type}'.`
      );
    }

    const previousState =
      entity.workflowState ??
      machine.initial;

    const currentState =
      machine.transition(
        previousState,
        action
      );

    this.entities.setWorkflowState(
      entity.id,
      currentState
    );

    this.history.append({
      entityId: entity.id,
      machine: machine.name,
      previousState,
      currentState,
      action,
      timestamp: new Date(),
    });

    const event: StateTransitionEvent = {
      type: "StateTransitioned",
      entityId: entity.id,
      machine: machine.name,
      previousState,
      currentState,
      action,
      timestamp: new Date(),
    };

    await this.events.publish(event);

    return entity;
  }

  /**
   * Available actions.
   */
  actions(
    entityId: string
  ): readonly string[] {

    const entity =
      this.entities.get(entityId);

    if (!entity) {
      return [];
    }

    const machine =
      this.machines.get(entity.type);

    if (!machine) {
      return [];
    }

    return machine.actions(
      entity.workflowState ??
      machine.initial
    );
  }

  /**
   * Workflow history.
   */
  historyOf(
    entityId: string
  ) {
    return this.history.all(entityId);
  }
}