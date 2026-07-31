import { Client } from "./Client";
import { ClientId } from "./ClientId";

/**
 * Defines the persistence contract
 * for OAuth Clients.
 */
export interface ClientRepository {

  /**
   * Stores a new Client.
   */
  create(
    client: Client
  ): Promise<void>;

  /**
   * Persists changes to
   * an existing Client.
   */
  update(
    client: Client
  ): Promise<void>;

  /**
   * Finds a Client by
   * its internal ID.
   */
  findById(
    id: string
  ): Promise<Client | null>;

  /**
   * Finds a Client using
   * its public Client ID.
   */
  findByClientId(
    clientId: ClientId
  ): Promise<Client | null>;

  /**
   * Finds a Client
   * using its slug.
   */
  findBySlug(
    slug: string
  ): Promise<Client | null>;

  /**
   * Returns all Clients
   * owned by an account.
   */
  findByOwner(
    ownerAccountId: string
  ): Promise<Client[]>;

  /**
   * Removes a Client.
   */
  delete(
    id: string
  ): Promise<void>;

}