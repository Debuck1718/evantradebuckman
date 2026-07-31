import { TransitionRecord } from "./TransitionRecord";

/**
 * TransitionHistory
 *
 * Stores the complete workflow transition history
 * for every entity managed by the kernel.
 *
 * This service acts as the central repository for
 * TransitionRecord objects.
 */
export class TransitionHistory {
  /**
   * Transition records grouped by entity ID.
   */
  private readonly records =
    new Map<string, TransitionRecord[]>();

  /**
   * Appends a new transition record.
   */
  append(
    record: TransitionRecord
  ): void {
    const history =
      this.records.get(record.entityId) ?? [];

    history.push(record);

    this.records.set(
      record.entityId,
      history
    );
  }

  /**
   * Returns every transition
   * for an entity.
   */
  all(
    entityId: string
  ): readonly TransitionRecord[] {
    return this.records.get(entityId) ?? [];
  }

  /**
   * Returns the most recent transition
   * for an entity.
   */
  latest(
    entityId: string
  ): TransitionRecord | undefined {
    const history =
      this.records.get(entityId);

    return history?.at(-1);
  }

  /**
   * Returns the first transition
   * for an entity.
   */
  first(
    entityId: string
  ): TransitionRecord | undefined {
    const history =
      this.records.get(entityId);

    return history?.[0];
  }

  /**
   * Returns true if the entity has
   * transition history.
   */
  has(
    entityId: string
  ): boolean {
    return (
      this.records.has(entityId) &&
      (this.records.get(entityId)?.length ?? 0) > 0
    );
  }

  /**
   * Returns the number of transitions
   * for a specific entity.
   */
  count(
    entityId?: string
  ): number {
    if (entityId) {
      return (
        this.records.get(entityId)?.length ?? 0
      );
    }

    let total = 0;

    for (const history of this.records.values()) {
      total += history.length;
    }

    return total;
  }

  /**
   * Removes the history for one entity.
   */
  clear(
    entityId: string
  ): boolean {
    return this.records.delete(entityId);
  }

  /**
   * Removes every transition record.
   */
  clearAll(): void {
    this.records.clear();
  }

  /**
   * Returns every entity ID that has
   * transition history.
   */
  entities(): readonly string[] {
    return [...this.records.keys()];
  }

  /**
   * Returns every transition record
   * across every entity.
   */
  recordsList(): readonly TransitionRecord[] {
    return [...this.records.values()].flat();
  }

  /**
   * Returns true if no history exists.
   */
  isEmpty(): boolean {
    return this.records.size === 0;
  }

  /**
   * Returns a serializable representation
   * of the transition history.
   */
  toJSON(): Record<string, TransitionRecord[]> {
    return Object.fromEntries(this.records);
  }
}