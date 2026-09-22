/**
 * Represents a scope an OAuth client is
 * permitted to request.
 *
 * Registered scopes are the allow-list: an
 * authorization request asking for anything
 * outside this set must be rejected rather
 * than silently granted.
 *
 * RFC6749 section 3.3
 */
export class ClientScope {

  private constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * OAuth client the scope belongs to.
     */
    public readonly clientId: string,

    /**
     * The permitted scope value.
     */
    public readonly scope: string,

    /**
     * When the scope was registered.
     */
    public readonly createdAt: Date,

  ) { }

  /**
   * Registers a new client scope.
   */
  static create(params: {

    id: string;

    clientId: string;

    scope: string;

    createdAt: Date;

  }): ClientScope {

    const normalized =
      params.scope.trim();

    if (!normalized) {

      throw new Error(
        "Client scope is required.",
      );

    }

    return new ClientScope(

      params.id,

      params.clientId,

      normalized,

      params.createdAt,

    );

  }

  /**
   * Restores a client scope
   * from storage.
   */
  static restore(params: {

    id: string;

    clientId: string;

    scope: string;

    createdAt: Date;

  }): ClientScope {

    return new ClientScope(

      params.id,

      params.clientId,

      params.scope,

      params.createdAt,

    );

  }

}