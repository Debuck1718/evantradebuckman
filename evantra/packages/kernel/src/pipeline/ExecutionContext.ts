import { Command } from "../command/Command";

/**
 * Represents a single execution flowing through the kernel.
 * The request is generic so the pipeline can later execute
 * workflows, AI tasks, jobs, graphs, etc.
 */
export class ExecutionContext<T = unknown> {
  /**
   * The request currently being executed.
   */
  public readonly request: T;

  /**
   * When execution started.
   */
  public readonly startedAt: Date;

  /**
   * Shared execution metadata.
   */
  public readonly metadata = new Map<string, unknown>();

  constructor(request: T) {
    this.request = request;
    this.startedAt = new Date();
  }

  /**
   * Convenience helper for today's command-based runtime.
   */
  get command(): Command | undefined {
    return this.request as Command;
  }

  /**
   * Total elapsed time in milliseconds.
   */
  elapsed(): number {
    return Date.now() - this.startedAt.getTime();
  }

  set(key: string, value: unknown): void {
    this.metadata.set(key, value);
  }

  get<TValue = unknown>(key: string): TValue | undefined {
    return this.metadata.get(key) as TValue | undefined;
  }

  has(key: string): boolean {
    return this.metadata.has(key);
  }

  delete(key: string): boolean {
    return this.metadata.delete(key);
  }

  clear(): void {
    this.metadata.clear();
  }
}