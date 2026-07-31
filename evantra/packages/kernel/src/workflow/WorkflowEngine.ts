import { Kernel } from "../core/Kernel";

import { Event } from "../event/Event";
import { EventContext } from "../event/EventContext";
import { EventSubscriber } from "../event/EventSubscriber";

import { Workflow } from "./Workflow";
import { WorkflowContext } from "./WorkflowContext";
import { WorkflowRegistry } from "./WorkflowRegistry";

/**
 * Executes workflows in response
 * to kernel events.
 */
export class WorkflowEngine
  implements EventSubscriber<Event>
{
  constructor(
    private readonly kernel: Kernel,
    private readonly workflows: WorkflowRegistry
  ) {}

  /**
   * Returns true if one or more
   * workflows are registered for
   * the supplied event.
   */
  supports(
    event: Event
  ): boolean {
    return (
      this.workflows.get(event.type).length > 0
    );
  }

  /**
   * Handles an event published
   * by the EventBus.
   */
  async handle(
    eventContext: EventContext<Event>
  ): Promise<void> {

    const workflowContext =
      new WorkflowContext(
        this.kernel,
        eventContext
      );

    const workflows =
      this.workflows.get(
        eventContext.event.type
      );

    for (const workflow of workflows) {

      if (workflow.enabled === false) {
        continue;
      }

      await this.executeWorkflow(
        workflow,
        workflowContext
      );
    }
  }

  /**
   * Executes every activity
   * in the workflow.
   */
  private async executeWorkflow(
    workflow: Workflow,
    context: WorkflowContext
  ): Promise<void> {

    for (const activity of workflow.activities) {
      await activity.execute(context);
    }
  }
}