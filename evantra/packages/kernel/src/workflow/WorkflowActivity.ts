import { WorkflowContext } from "./WorkflowContext";

/**
 * Represents a single unit of work
 * executed by a workflow.
 *
 * Activities are executed
 * sequentially by the WorkflowEngine.
 */
export interface WorkflowActivity {
  /**
   * Unique activity identifier.
   */
  readonly id: string;

  /**
   * Human-readable activity name.
   */
  readonly name: string;

  /**
   * Executes the activity.
   */
  execute(
    context: WorkflowContext
  ): Promise<void>;
}