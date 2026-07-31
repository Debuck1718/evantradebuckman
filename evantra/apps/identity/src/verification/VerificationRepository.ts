import { Verification } from "./Verification";

/**
 * Defines the persistence contract
 * for account verification requests.
 */
export interface VerificationRepository {

  /**
   * Creates a new verification request.
   */
  create(
    verification: Verification
  ): Promise<void>;

  /**
   * Persists changes to an
   * existing verification request.
   */
  update(
    verification: Verification
  ): Promise<void>;

  /**
   * Finds a verification request
   * by its unique identifier.
   */
  findById(
    id: string
  ): Promise<Verification | null>;

  /**
   * Finds a verification request
   * using its verification token.
   */
  findByToken(
    token: string
  ): Promise<Verification | null>;

  /**
   * Finds the latest verification
   * request for an account.
   */
  findByAccountId(
    accountId: string
  ): Promise<Verification | null>;

  /**
   * Removes a verification request.
   */
  delete(
    id: string
  ): Promise<void>;
}