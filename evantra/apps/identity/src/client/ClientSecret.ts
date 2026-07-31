/**
 * Represents an OAuth
 * Client Secret.
 *
 * This is the plain-text
 * secret presented once to
 * the client owner.
 *
 * The hash is stored by
 * the repository.
 */
export class ClientSecret {

  private constructor(
    private readonly value_: string
  ) {}

  static from(
    value: string
  ): ClientSecret {

    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        "Client secret is required."
      );
    }

    if (normalized.length < 32) {
      throw new Error(
        "Client secret is too short."
      );
    }

    return new ClientSecret(
      normalized
    );
  }

  value(): string {
    return this.value_;
  }

  toString(): string {
    return this.value_;
  }

}