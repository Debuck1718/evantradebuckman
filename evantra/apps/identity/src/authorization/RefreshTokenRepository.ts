import { RefreshToken } from "./RefreshToken";

/**
 * Repository for persisted
 * OAuth Refresh Tokens.
 */
export interface RefreshTokenRepository {

  /**
   * Stores a new Refresh Token.
   */
  create(
    token: RefreshToken,
    
  ): Promise<void>;

  /**
   * Persists changes.
   */
  update(
    token: RefreshToken,
  ): Promise<void>;

  /**
   * Finds a Refresh Token
   * using its internal ID.
   */
  findById(
    id: string,
  ): Promise<RefreshToken | null>;

  /**
   * Finds a Refresh Token
   * using its public token.
   */
  findByToken(
    token: string,
  ): Promise<RefreshToken | null>;

  /**
   * Finds an active Refresh Token
   * using its public token.
   */
  findActiveByToken(
    token: string,
  ): Promise<RefreshToken | null>;

  /**
   * Finds the Refresh Token
   * associated with an
   * Access Token.
   */
  findByAccessTokenId(
    accessTokenId: string,
  ): Promise<RefreshToken | null>;

  /**
   * Deletes a Refresh Token.
   */
  delete(
    id: string,
  ): Promise<void>;

}