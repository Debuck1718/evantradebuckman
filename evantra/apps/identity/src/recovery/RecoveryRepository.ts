import { Recovery } from "./Recovery";

/**
 * Defines the persistence contract
 * for password recovery requests.
 */
export interface RecoveryRepository {

  /**
   * Creates a new recovery request.
   */
  create(
    recovery: Recovery
  ): Promise<void>;

  /**
   * Persists changes to an
   * existing recovery request.
   */
  update(
    recovery: Recovery
  ): Promise<void>;

  /**
   * Finds a recovery request
   * by its unique identifier.
   */
  findById(
    id: string
  ): Promise<Recovery | null>;

  /**
   * Finds a recovery request
   * using its recovery token.
   */
  findByToken(
    token: string
  ): Promise<Recovery | null>;

  /**
   * Finds the latest recovery
   * request for an account.
   */
  findByAccountId(
    accountId: string
  ): Promise<Recovery | null>;

  /**
   * Removes a recovery request.
   */
  delete(
    id: string
  ): Promise<void>;
}