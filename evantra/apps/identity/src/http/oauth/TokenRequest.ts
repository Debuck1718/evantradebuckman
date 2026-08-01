/**
 * OAuth Token Request.
 *
 * RFC6749
 */
export interface TokenRequest {

  /**
   * OAuth grant type.
   */
  grant_type: string;

  /**
   * OAuth Client ID.
   */
  client_id: string;

  /**
   * OAuth Client Secret.
   */
  client_secret?: string;

  /**
   * Authorization Code.
   */
  code?: string;

  /**
   * Refresh Token.
   */
  refresh_token?: string;

  /**
   * Redirect URI.
   */
  redirect_uri?: string;

  /**
   * PKCE verifier.
   */
  code_verifier?: string;

  /**
   * Requested scopes.
   */
  scope?: string;

}