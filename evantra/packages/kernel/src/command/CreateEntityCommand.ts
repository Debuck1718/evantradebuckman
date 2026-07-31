import { Command } from "./Command";

export interface CreateEntityPayload {
  id: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export class CreateEntityCommand
  implements Command<CreateEntityPayload>
{
  readonly type = "CreateEntity";

  constructor(
    public readonly payload: CreateEntityPayload
  ) {}
}