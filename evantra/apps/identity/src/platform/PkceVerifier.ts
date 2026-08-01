/**
 * Verifies OAuth PKCE
 * code challenges.
 *
 * RFC7636
 */
export interface PkceVerifier {

  /**
   * Verifies a PKCE
   * code verifier.
   */
  verify(params: {

    /**
     * The verifier sent
     * by the OAuth client.
     */
    codeVerifier: string;

    /**
     * Stored challenge.
     */
    codeChallenge: string;

    /**
     * PKCE method.
     */
    method: "plain" | "S256";

  }): Promise<boolean>;

}