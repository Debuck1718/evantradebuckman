import { OAuthTokenType } from "./OAuthTokenType";

/**
 * OAuth Token Response.
 *
 * RFC6749
 * Section 5.1
 */
export class TokenResponse {

  constructor(

    public readonly accessToken: string,

    public readonly tokenType: OAuthTokenType,

    public readonly expiresIn: number,

    public readonly refreshToken: string | null,

    public readonly scope: string,

  ) {}

}