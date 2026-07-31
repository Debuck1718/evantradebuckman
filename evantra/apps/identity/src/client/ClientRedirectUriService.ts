import { ClientRedirectUri } from "./ClientRedirectUri";
import { ClientRedirectUriRepository } from "./ClientRedirectUriRepository";
import { RedirectUri } from "./RedirectUri";

/**
 * Coordinates Redirect URI
 * registration.
 */
export class ClientRedirectUriService {

  constructor(
    private readonly repository: ClientRedirectUriRepository
  ) {}

  /**
   * Registers a Redirect URI.
   */
  async register(
    redirect: ClientRedirectUri
  ): Promise<ClientRedirectUri> {

    const existing =
      await this.repository.findByRedirectUri(
        redirect.clientId,
        redirect.redirectUri
      );

    if (existing) {
      throw new Error(
        "Redirect URI already exists."
      );
    }

    // Ensure only one primary
    // Redirect URI exists.
    if (redirect.isPrimary()) {

      const primary =
        await this.repository.findPrimary(
          redirect.clientId
        );

      if (primary) {

        primary.clearPrimary();

        await this.repository.update(
          primary
        );

      }

    }

    await this.repository.create(
      redirect
    );

    return redirect;

  }

  /**
   * Finds a Redirect URI
   * by its identifier.
   */
  async findById(
    id: string
  ): Promise<ClientRedirectUri | null> {

    return this.repository.findById(
      id
    );

  }

  /**
   * Returns every Redirect URI
   * registered for a Client.
   */
  async findByClient(
    clientId: string
  ): Promise<ClientRedirectUri[]> {

    return this.repository.findByClientId(
      clientId
    );

  }

  /**
   * Finds an exact Redirect URI
   * for a Client.
   */
  async findByRedirectUri(
    clientId: string,
    redirectUri: RedirectUri
  ): Promise<ClientRedirectUri | null> {

    return this.repository.findByRedirectUri(
      clientId,
      redirectUri
    );

  }

  /**
   * Returns the primary
   * Redirect URI.
   */
  async primary(
    clientId: string
  ): Promise<ClientRedirectUri | null> {

    return this.repository.findPrimary(
      clientId
    );

  }

  /**
   * Deletes a Redirect URI.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.repository.delete(
      id
    );

  }

}
