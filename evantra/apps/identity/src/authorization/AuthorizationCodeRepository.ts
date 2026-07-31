import { AuthorizationCode } from "./AuthorizationCode";

/**
 * Defines persistence
 * operations for OAuth
 * Authorization Codes.
 */
export interface AuthorizationCodeRepository {

  /**
   * Stores a code.
   */
  create(
    code: AuthorizationCode
  ): Promise<void>;

  /**
   * Persists changes.
   */
  update(
    code: AuthorizationCode
  ): Promise<void>;

  /**
   * Finds by ID.
   */
  findById(
    id: string
  ): Promise<AuthorizationCode | null>;

  /**
   * Finds by public code.
   */
  findByCode(
    code: string
  ): Promise<AuthorizationCode | null>;

  /**
 * Finds an active Authorization
 * Code using its public code.
 *
 * Active means the code has not
 * yet been consumed.
 */
findActiveByCode(
  code: string
): Promise<AuthorizationCode | null>;

  /**
   * Deletes a code.
   */
  delete(
    id: string
  ): Promise<void>;

}