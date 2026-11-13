import { ClientService } from "../client";

/**
 * Returns only the public identity details required by the OAuth consent screen.
 * Client credentials and internal account information are deliberately omitted.
 */
export class GetClientDisplayInfoWorkflow {
  constructor(
    private readonly clients: ClientService,
  ) { }

  async execute(clientId: string): Promise<{
    name: string;
    homepageUrl: string | null;
    description: string | null;
  } | null> {
    const client = await this.clients.findByClientId(clientId);

    if (!client || !client.isActive()) {
      return null;
    }

    return {
      name: client.name,
      homepageUrl: client.homepageUrl,
      description: client.description,
    };
  }
}
