/**
 * Represents the public OAuth
 * Client Identifier.
 *
 * The Client ID identifies an
 * application during OAuth and
 * OpenID Connect flows.
 *
 * Unlike the internal database ID,
 * the Client ID is intended to be
 * shared publicly.
 */
export class ClientId {

  /**
   * Reserved Client IDs.
   */
  private static readonly RESERVED = [
    "admin",
    "api",
    "authorize",
    "callback",
    "connect",
    "consent",
    "evantra",
    "identity",
    "login",
    "logout",
    "oauth",
    "oidc",
    "register",
    "root",
    "system",
    "token",
    "userinfo",
    "well-known",
  ];

  /**
   * Creates a Client ID.
   */
  private constructor(
    private readonly id: string
  ) {}

  /**
   * Creates a Client ID from
   * user input.
   */
  static from(
    value: string
  ): ClientId {

    const normalized =
      value
        .trim()
        .toLowerCase();

    if (!normalized) {
      throw new Error(
        "Client ID is required."
      );
    }

    if (normalized.length < 3) {
      throw new Error(
        "Client ID must contain at least 3 characters."
      );
    }

    if (normalized.length > 100) {
      throw new Error(
        "Client ID cannot exceed 100 characters."
      );
    }

    if (
      !/^[a-z0-9._-]+$/.test(
        normalized
      )
    ) {
      throw new Error(
        "Client ID contains invalid characters."
      );
    }

    if (
      ClientId.RESERVED.includes(
        normalized
      )
    ) {
      throw new Error(
        "This Client ID is reserved."
      );
    }

    return new ClientId(
      normalized
    );
  }

  /**
   * Returns the raw Client ID.
   */
  value(): string {
    return this.id;
  }

  /**
   * Compares two Client IDs.
   */
  equals(
    other: ClientId
  ): boolean {

    return this.id === other.id;
  }

  /**
   * Returns the Client ID
   * as a string.
   */
  toString(): string {
    return this.id;
  }

}