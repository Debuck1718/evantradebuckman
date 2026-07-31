import { Token } from "./Token";

/**
 * Represents an OAuth
 * Access Token.
 *
 * Access Tokens are presented
 * to Resource Servers when
 * calling protected APIs.
 */
export class AccessToken
  extends Token {

  /**
   * Creates an Access Token.
   */
  private constructor(

    id: string,

    accountId: string,

    clientId: string,

    scopes: string[],

    expiresAt: Date,

    revokedAt: Date | null,

    createdAt: Date,

    /**
     * Public Access Token.
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
   * Issues a new Access Token.
   */
  static create(params: {

    id: string;

    accountId: string;

    clientId: string;

    token: string;

    scopes: string[];

    expiresAt: Date;

  }): AccessToken {

    return new AccessToken(

      params.id,

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
   * Access Token.
   */
  static restore(params: {

    id: string;

    accountId: string;

    clientId: string;

    token: string;

    scopes: string[];

    expiresAt: Date;

    revokedAt: Date | null;

    createdAt: Date;

  }): AccessToken {

    return new AccessToken(

      params.id,

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