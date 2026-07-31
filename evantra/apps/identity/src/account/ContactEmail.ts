/**
 * Represents the contact email
 * associated with an Evantra Account.
 *
 * This email is used for:
 *
 * - Verification
 * - Password recovery
 * - Security notifications
 *
 * It is NOT the user's
 * Evantra Identity.
 */
export class ContactEmail {

  /**
   * Creates a contact email.
   */
  private constructor(
    private readonly email: string
  ) {}

  /**
   * Creates a ContactEmail from
   * user input.
   */
  static from(
    value: string
  ): ContactEmail {

    const normalized =
      value
        .trim()
        .toLowerCase();

    if (!normalized) {
      throw new Error(
        "Contact email is required."
      );
    }

    // Simple email validation.
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalized
      )
    ) {
      throw new Error(
        "Invalid contact email."
      );
    }

    return new ContactEmail(
      normalized
    );
  }

  /**
   * Returns the raw email.
   */
  value(): string {
    return this.email;
  }

  /**
   * Compares two contact emails.
   */
  equals(
    other: ContactEmail
  ): boolean {
    return this.email === other.email;
  }

  /**
   * Returns the email as a string.
   */
  toString(): string {
    return this.email;
  }
}