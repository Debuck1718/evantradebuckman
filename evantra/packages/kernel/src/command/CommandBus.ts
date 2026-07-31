import { Command } from "./Command";
import { CommandHandler } from "./CommandHandler";
import { ExecutionContext } from "../pipeline";

export class CommandBus {

  private readonly handlers: CommandHandler[] = [];

  register(handler: CommandHandler): this {
    this.handlers.push(handler);
    return this;
  }

  async execute<T extends Command>(
    context: ExecutionContext<T>
  ): Promise<void> {

    const command = context.request;

    const handler = this.handlers.find(h =>
      h.supports(command)
    );

    if (!handler) {
      throw new Error(
        `No handler registered for "${command.type}".`
      );
    }

    await handler.execute(context);

  }

  handlersList(): readonly CommandHandler[] {
    return this.handlers;
  }

  count(): number {
    return this.handlers.length;
  }

  clear(): void {
    this.handlers.length = 0;
  }

  isEmpty(): boolean {
    return this.handlers.length === 0;
  }

}