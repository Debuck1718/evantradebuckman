/**
 * Result of a successful
 * OAuth Authorization Request.
 *
 * The controller will convert
 * this into a redirect.
 */
export class AuthorizationResponse {

  constructor(

    /**
     * OAuth Client.
     */
    public readonly clientId: string,

    /**
     * Issued Authorization Code.
     */
    public readonly code: string,

    /**
     * Redirect URI.
     */
    public readonly redirectUri: string,

    /**
     * OAuth state.
     */
    public readonly state: string | null,

  ) {}

}