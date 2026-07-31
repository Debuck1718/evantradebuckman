import { Credential } from "./Credential";

/**
 * Defines the persistence contract
 * for account credentials.
 *
 * Repository implementations are
 * responsible for storing and
 * retrieving Credential entities.
 */
export interface CredentialRepository {

  /**
   * Creates a new credential.
   */
  create(
    credential: Credential
  ): Promise<void>;

  /**
   * Persists changes made to
   * an existing credential.
   */
  update(
    credential: Credential
  ): Promise<void>;

  /**
   * Finds a credential using
   * its associated account ID.
   */
  findByAccountId(
    accountId: string
  ): Promise<Credential | null>;

  /**
   * Removes a credential.
   */
  delete(
    accountId: string
  ): Promise<void>;
}