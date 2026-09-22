import {
  ClientScope,
} from "./ClientScope";

/**
 * Persistence contract for
 * client scopes.
 */
export interface ClientScopeRepository {

  /**
   * Stores a new client scope.
   */
  create(
    scope: ClientScope,
  ): Promise<void>;

  /**
   * Finds a scope by its
   * internal identifier.
   */
  findById(
    id: string,
  ): Promise<ClientScope | null>;

  /**
   * Finds a single scope registered
   * for a client.
   */
  find(
    clientId: string,
    scope: string,
  ): Promise<ClientScope | null>;

  /**
   * Returns every scope registered
   * for a client.
   */
  findByClientId(
    clientId: string,
  ): Promise<ClientScope[]>;

  /**
   * Removes a scope.
   */
  delete(
    id: string,
  ): Promise<void>;

}