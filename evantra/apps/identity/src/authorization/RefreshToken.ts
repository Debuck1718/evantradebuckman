import { Token } from "./Token";

/**
 * Represents an OAuth
 * Refresh Token.
 *
 * Refresh Tokens are long-lived
 * credentials used to obtain
 * new Access Tokens.
 */
export class RefreshToken
  extends Token {

  /**
   * Creates a Refresh Token.
   */
  private constructor(

    id: string,

    /**
     * Associated Access Token.
     */
    public readonly accessTokenId: string,

    accountId: string,

    clientId: string,

    scopes: string[],

    expiresAt: Date,

    revokedAt: Date | null,

    createdAt: Date,

    /**
     * Public Refresh Token.
     */
    public readonly token: string,

  ) {

    super(

      id,

      accountId,

      clientId,

      scopes,

      expiresAt,

      revokedAt,

      createdAt,

    );

  }

  /**
   * Issues a new Refresh Token.
   */
  static create(params: {

    id: string;

    accessTokenId: string;

    accountId: string;

    clientId: string;

    token: string;

    scopes: string[];

    expiresAt: Date;

  }): RefreshToken {

    return new RefreshToken(

      params.id,

      params.accessTokenId,

      params.accountId,

      params.clientId,

      params.scopes,

      params.expiresAt,

      null,

      new Date(),

      params.token,

    );

  }

  /**
   * Restores a persisted
   * Refresh Token.
   */
  static restore(params: {

    id: string;

    accessTokenId: string;

    accountId: string;

    clientId: string;

    token: string;

    scopes: string[];

    expiresAt: Date;

    revokedAt: Date | null;

    createdAt: Date;

  }): RefreshToken {

    return new RefreshToken(

      params.id,

      params.accessTokenId,

      params.accountId,

      params.clientId,

      params.scopes,

      new Date(params.expiresAt),

      params.revokedAt
        ? new Date(params.revokedAt)
        : null,

      new Date(params.createdAt),

      params.token,

    );

  }

}