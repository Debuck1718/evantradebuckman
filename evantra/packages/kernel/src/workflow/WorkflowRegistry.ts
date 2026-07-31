import { Workflow } from "./Workflow";

/**
 * Stores every workflow registered
 * with the kernel.
 */
export class WorkflowRegistry {
  /**
   * Workflows grouped by event type.
   */
  private readonly workflows =
    new Map<string, Workflow[]>();

  /**
   * Registers a workflow.
   */
  register(
    workflow: Workflow
  ): void {

    const list =
      this.workflows.get(workflow.event) ?? [];

    if (
      list.some(
        w => w.id === workflow.id
      )
    ) {
      throw new Error(
        `Workflow '${workflow.id}' is already registered.`
      );
    }

    list.push(workflow);

    this.workflows.set(
      workflow.event,
      list
    );
  }

  /**
   * Returns every workflow
   * listening for an event.
   */
  get(
    event: string
  ): readonly Workflow[] {
    return this.workflows.get(event) ?? [];
  }

  /**
   * Returns every workflow.
   */
  all(): readonly Workflow[] {
    return [...this.workflows.values()]
      .flat();
  }

  /**
   * Returns true if the workflow exists.
   */
  has(
    id: string
  ): boolean {

    return this.all().some(
      workflow => workflow.id === id
    );
  }

  /**
   * Removes a workflow.
   */
  unregister(
    id: string
  ): boolean {

    for (const [event, list] of this.workflows) {

      const index =
        list.findIndex(
          workflow => workflow.id === id
        );

      if (index !== -1) {

        list.splice(index, 1);

        if (list.length === 0) {
          this.workflows.delete(event);
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Removes every workflow.
   */
  clear(): void {
    this.workflows.clear();
  }

  /**
   * Number of workflows.
   */
  count(): number {
    return this.all().length;
  }

  /**
   * Returns every event
   * with registered workflows.
   */
  events(): readonly string[] {
    return [...this.workflows.keys()];
  }

  /**
   * Diagnostics.
   */
  toJSON() {
    return Object.fromEntries(
      [...this.workflows.entries()].map(
        ([event, workflows]) => [
          event,
          workflows.map(w => w.id),
        ]
      )
    );
  }
}