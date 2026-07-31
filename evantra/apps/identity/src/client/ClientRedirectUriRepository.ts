import { ClientRedirectUri } from "./ClientRedirectUri";
import { RedirectUri } from "./RedirectUri";

/**
 * Defines the persistence contract
 * for Client Redirect URIs.
 */
export interface ClientRedirectUriRepository {

  /**
   * Stores a Redirect URI.
   */
  create(
    redirect: ClientRedirectUri
  ): Promise<void>;

  /**
   * Persists changes.
   */
  update(
    redirect: ClientRedirectUri
  ): Promise<void>;

  /**
   * Finds a Redirect URI.
   */
  findById(
    id: string
  ): Promise<ClientRedirectUri | null>;

  /**
   * Finds every Redirect URI
   * registered for a Client.
   */
  findByClientId(
    clientId: string
  ): Promise<ClientRedirectUri[]>;

  /**
   * Finds an exact Redirect URI.
   */
  findByRedirectUri(
    clientId: string,
    redirectUri: RedirectUri
  ): Promise<ClientRedirectUri | null>;

  /**
   * Returns the primary Redirect URI.
   */
  findPrimary(
    clientId: string
  ): Promise<ClientRedirectUri | null>;

  /**
   * Removes a Redirect URI.
   */
  delete(
    id: string
  ): Promise<void>;

}