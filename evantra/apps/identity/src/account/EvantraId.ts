/**
 * Represents a user's unique
 * Evantra Identity.
 *
 * Canonical format:
 *
 *     local-part@evantra
 *
 * Example:
 *
 *     debuck@evantra
 */
export class EvantraId {

  /**
   * Evantra Identity namespace.
   */
  private static readonly DOMAIN =
    "@evantra";

  /**
   * Reserved Evantra IDs.
   *
   * These values refer to the
   * local portion of an Evantra ID.
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
    private readonly id: string,
  ) {}

  /**
   * Creates an Evantra ID from
   * user input.
   *
   * Accepted input:
   *
   *     debuck
   *
   * or:
   *
   *     debuck@evantra
   *
   * Internally both become:
   *
   *     debuck@evantra
   */
  static from(
    value: string,
  ): EvantraId {

    const normalized =
      value
        .trim()
        .toLowerCase();

    if (!normalized) {

      throw new Error(
        "Evantra ID is required.",
      );

    }

    let localPart: string;

    if (
      normalized.endsWith(
        EvantraId.DOMAIN,
      )
    ) {

      localPart =
        normalized.slice(
          0,
          -EvantraId.DOMAIN.length,
        );

    } else {

      localPart =
        normalized;

    }

    if (!localPart) {

      throw new Error(
        "Evantra ID is required.",
      );

    }

    if (localPart.length < 3) {

      throw new Error(
        "Evantra ID must contain at least 3 characters.",
      );

    }

    if (localPart.length > 30) {

      throw new Error(
        "Evantra ID cannot exceed 30 characters.",
      );

    }

    if (
      !/^[a-z0-9._]+$/.test(
        localPart,
      )
    ) {

      throw new Error(
        "Evantra ID can only contain lowercase letters, numbers, periods, and underscores.",
      );

    }

    if (
      localPart.startsWith(".") ||
      localPart.endsWith(".") ||
      localPart.startsWith("_") ||
      localPart.endsWith("_")
    ) {

      throw new Error(
        "Evantra ID cannot start or end with a period or underscore.",
      );

    }

    if (
  localPart.includes("..") ||
  localPart.includes("__") ||
  localPart.includes("._") ||
  localPart.includes("_.")
) {
  throw new Error(
    "Evantra ID cannot contain consecutive periods or underscores.",
  );
}

    if (
      EvantraId.RESERVED.includes(
        localPart,
      )
    ) {

      throw new Error(
        "This Evantra ID is reserved.",
      );

    }

    return new EvantraId(
      `${localPart}${EvantraId.DOMAIN}`,
    );

  }

  /**
   * Returns the canonical Evantra ID.
   *
   * Example:
   *
   *     debuck@evantra
   */
  value(): string {

    return this.id;

  }

  /**
   * Returns the local portion.
   *
   * Example:
   *
   *     debuck
   */
  localPart(): string {

    return this.id.slice(
      0,
      -EvantraId.DOMAIN.length,
    );

  }

  /**
   * Compares two identities.
   */
  equals(
    other: EvantraId,
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