import {
  Client,
  ClientService,
} from "../client";

/**
 * Approves a pending OAuth client.
 */
export class ApproveClientWorkflow {

  constructor(
    private readonly clients:
      ClientService,
  ) {}

  async execute(params: {
    clientId: string;
  }): Promise<Client> {
    const client =
      await this.clients.findByClientId(
        params.clientId,
      );

    if (!client) {
      throw new Error(
        "Client not found.",
      );
    }

    await this.clients.approve(
      client,
    );

    return client;
  }

}
