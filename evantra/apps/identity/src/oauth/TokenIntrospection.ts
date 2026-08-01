/**
 * RFC7662
 * Token Introspection Response.
 */
export class TokenIntrospection {

  constructor(

    public readonly active: boolean,

    public readonly clientId: string | null,

    public readonly accountId: string | null,

    public readonly scope: string | null,

    public readonly expiresAt: number | null,

  ) {}

}