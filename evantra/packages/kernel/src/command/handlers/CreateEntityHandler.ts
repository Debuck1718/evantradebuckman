import { Command } from "../Command";
import { CommandHandler } from "../CommandHandler";
import { CreateEntityCommand } from "../CreateEntityCommand";
import { EntityRegistry } from "../../entity/EntityRegistry";
import { ExecutionContext } from "../../pipeline";

export class CreateEntityHandler
  implements CommandHandler<CreateEntityCommand>
{
  constructor(
    private readonly entities: EntityRegistry
  ) {}

  supports(command: Command): command is CreateEntityCommand {
    return command.type === "CreateEntity";
  }

  async execute(
    context: ExecutionContext<CreateEntityCommand>
  ): Promise<void> {

    const command = context.request;

    this.entities.create(command.payload);

  }
}