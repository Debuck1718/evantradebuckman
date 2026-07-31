import { ExecutionContext } from "./ExecutionContext";
import { PipelineStep } from "./PipelineStep";

export class LoggingStep implements PipelineStep {

  async handle(
    context: ExecutionContext,
    next: () => Promise<void>
  ): Promise<void> {

    const request =
      context.command?.type ??
      context.request?.constructor?.name ??
      "Unknown";

    console.log(`▶ ${request}`);

    const started = Date.now();

    try {

      await next();

    } finally {

      console.log(
        `✔ ${request} (${Date.now() - started} ms)`
      );

    }
  }

}