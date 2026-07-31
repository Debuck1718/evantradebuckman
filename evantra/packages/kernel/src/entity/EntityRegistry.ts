import { Entity } from "./Entity";

import { EventBus } from "../event/EventBus";

import { EntityStatus } from "../state/EntityStatus";

/**
 * EntityRegistry
 *
 * Responsible for storing and managing
 * every entity known to the kernel.
 */
export class EntityRegistry {
  private readonly entities =
    new Map<string, Entity>();

  constructor(
    private readonly eventBus: EventBus
  ) {}

  /**
   * Creates a new entity.
   */
  async create(
    input: Omit<Entity, "status">
  ): Promise<Entity> {
    if (this.entities.has(input.id)) {
      throw new Error(
        `Entity '${input.id}' already exists.`
      );
    }

    const entity: Entity = {
      ...input,

      status: EntityStatus.ACTIVE,
    };

    this.entities.set(
      entity.id,
      entity
    );

    await this.eventBus.publish({
      type: "EntityCreated",
      entityId: entity.id,
      timestamp: new Date(),
    });

    return entity;
  }

  /**
   * Returns an entity.
   */
  get(
    id: string
  ): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Returns true if the entity exists.
   */
  has(id: string): boolean {
    return this.entities.has(id);
  }

  /**
   * Returns every entity.
   */
  all(): readonly Entity[] {
    return [...this.entities.values()];
  }

  /**
   * Number of registered entities.
   */
  count(): number {
    return this.entities.size;
  }

  /**
   * Removes an entity.
   */
  remove(
    id: string
  ): boolean {
    return this.entities.delete(id);
  }

  /**
   * Removes every entity.
   */
  clear(): void {
    this.entities.clear();
  }

  /**
   * Returns true if no entities exist.
   */
  isEmpty(): boolean {
    return this.entities.size === 0;
  }

  /**
   * Updates an entity's workflow state.
   *
   * Used by the State Engine.
   */
  setWorkflowState(
    id: string,
    workflowState: string
  ): Entity {
    const entity =
      this.entities.get(id);

    if (!entity) {
      throw new Error(
        `Entity '${id}' was not found.`
      );
    }

    entity.workflowState =
      workflowState;

    return entity;
  }

  /**
   * Updates the operational status.
   */
  setStatus(
    id: string,
    status: EntityStatus
  ): Entity {
    const entity =
      this.entities.get(id);

    if (!entity) {
      throw new Error(
        `Entity '${id}' was not found.`
      );
    }

    entity.status = status;

    return entity;
  }
}