import { ExecutionContext } from "./ExecutionContext";

export interface PipelineStep {
  handle(
    context: ExecutionContext,
    next: () => Promise<void>
  ): Promise<void>;
}