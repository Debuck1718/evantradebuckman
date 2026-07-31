import { Command } from "./Command";
import { ExecutionContext } from "../pipeline";

export interface CommandHandler<T extends Command = Command> {
  /**
   * Returns true if this handler can execute the request.
   */
  supports(command: Command): command is T;

  /**
   * Executes the request.
   */
  execute(
    context: ExecutionContext<T>
  ): void | Promise<void>;
}