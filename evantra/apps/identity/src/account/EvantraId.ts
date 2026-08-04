/**
 * Represents a user's unique
 * Evantra Identity.
 */
export class EvantraId {

  /**
   * Reserved Evantra IDs.
   */
  private static readonly RESERVED = [
    "account",
    "admin",
    "administrator",
    "api",
    "auth",
    "identity",
    "login",
    "logout",
    "mail",
    "register",
    "root",
    "security",
    "support",
    "system",
  ];

  /**
   * Creates an Evantra ID.
   */
  private constructor(
    private readonly id: string
  ) {}

  /**
   * Creates an Evantra ID from
   * user input.
   */
  static from(
    value: string
  ): EvantraId {

    const normalized =
      value
        .trim()
        .toLowerCase();

    if (!normalized) {
      throw new Error(
        "Evantra ID is required."
      );
    }

    if (normalized.length < 3) {
      throw new Error(
        "Evantra ID must contain at least 3 characters."
      );
    }

    if (normalized.length > 30) {
      throw new Error(
        "Evantra ID cannot exceed 30 characters."
      );
    }

    if (
      !/^[a-z0-9._]+$/.test(
        normalized
      )
    ) {
      throw new Error(
        "Evantra ID contains invalid characters."
      );
    }

    if (
      EvantraId.RESERVED.includes(
        normalized
      )
    ) {
      throw new Error(
        "This Evantra ID is reserved."
      );
    }

    return new EvantraId(
      normalized
    );
  }

  /**
   * Returns the raw Evantra ID.
   */
  value(): string {
    return this.id;
  }

  /**
   * Compares two identities.
   */
  equals(
    other: EvantraId
  ): boolean {
    return this.id === other.id;
  }

  /**
   * Returns the identity as a string.
   */
  toString(): string {
    return this.id;
  }

  /**
 * Alias for from().
 *
 * Improves readability in
 * application code.
 */
static create(
  value: string,
): EvantraId {

  return EvantraId.from(
    value,
  );

}
}