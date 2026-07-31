import { RedirectUri } from "./RedirectUri";

/**
 * Represents a Redirect URI
 * registered for an OAuth Client.
 *
 * OAuth authorization requests
 * must exactly match one of the
 * registered Redirect URIs.
 */
export class ClientRedirectUri {

  /**
   * Creates a Client Redirect URI.
   */
  private constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * Owning Client.
     */
    public readonly clientId: string,

    /**
     * Registered Redirect URI.
     */
    public readonly redirectUri: RedirectUri,

    /**
     * Primary Redirect URI.
     */
    private primary: boolean,

    /**
     * Registration time.
     */
    public readonly createdAt: Date

  ) {}

  /**
   * Registers a Redirect URI.
   */
  static create(params: {

    id: string;

    clientId: string;

    redirectUri: RedirectUri;

    primary?: boolean;

  }): ClientRedirectUri {

    return new ClientRedirectUri(

      params.id,

      params.clientId,

      params.redirectUri,

      params.primary ?? false,

      new Date()

    );

  }

  /**
   * Restores a persisted Redirect URI.
   */
  static restore(params: {

    id: string;

    clientId: string;

    redirectUri: RedirectUri;

    primary: boolean;

    createdAt: Date;

  }): ClientRedirectUri {

    return new ClientRedirectUri(

      params.id,

      params.clientId,

      params.redirectUri,

      params.primary,

      new Date(params.createdAt)

    );

  }

  /**
   * Returns true if this is
   * the primary Redirect URI.
   */
  isPrimary(): boolean {

    return this.primary;

  }

  /**
   * Marks this Redirect URI
   * as primary.
   */
  makePrimary(): void {

    this.primary = true;

  }

  /**
   * Removes the primary flag.
   */
  clearPrimary(): void {

    this.primary = false;

  }

}