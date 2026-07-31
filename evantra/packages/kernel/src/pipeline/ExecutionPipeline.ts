import { ExecutionContext } from "./ExecutionContext";
import { PipelineStep } from "./PipelineStep";

export class ExecutionPipeline {
  private readonly steps: PipelineStep[] = [];

  use(step: PipelineStep): this {
    this.steps.push(step);
    return this;
  }

  remove(step: PipelineStep): boolean {
    const index = this.steps.indexOf(step);

    if (index === -1) {
      return false;
    }

    this.steps.splice(index, 1);
    return true;
  }

  clear(): void {
    this.steps.length = 0;
  }

  count(): number {
    return this.steps.length;
  }

  isEmpty(): boolean {
    return this.steps.length === 0;
  }

  list(): readonly PipelineStep[] {
    return [...this.steps];
  }

  async execute(
    context: ExecutionContext,
    terminal: () => Promise<void>
  ): Promise<void> {
    let current = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= current) {
        throw new Error(
          "next() called multiple times."
        );
      }

      current = index;

      if (index === this.steps.length) {
        await terminal();
        return;
      }

      const step = this.steps[index];

      await step.handle(
        context,
        () => dispatch(index + 1)
      );
    };

    await dispatch(0);
  }
}