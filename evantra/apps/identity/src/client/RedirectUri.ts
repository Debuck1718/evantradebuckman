/**
 * Represents an OAuth
 * Redirect URI.
 *
 * Redirect URIs are validated
 * before participating in
 * authorization flows.
 */
export class RedirectUri {

  private constructor(
    private readonly uri: string
  ) {}

  /**
   * Creates a Redirect URI.
   */
  static from(
    value: string
  ): RedirectUri {

    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        "Redirect URI is required."
      );
    }

    let parsed: URL;

    try {

      parsed =
        new URL(normalized);

    }
    catch {

      throw new Error(
        "Invalid redirect URI."
      );

    }

    // OAuth forbids URI fragments.
    if (parsed.hash) {
      throw new Error(
        "Redirect URI must not contain a fragment."
      );
    }

    const localhost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1";

    if (
      parsed.protocol !== "https:" &&
      !localhost
    ) {
      throw new Error(
        "Redirect URI must use HTTPS."
      );
    }

    return new RedirectUri(
      parsed.toString()
    );

  }

  /**
   * Returns the raw URI.
   */
  value(): string {

    return this.uri;

  }

  /**
   * Compares two URIs.
   */
  equals(
    other: RedirectUri
  ): boolean {

    return this.uri === other.uri;

  }

  /**
   * Returns the URI as text.
   */
  toString(): string {

    return this.uri;

  }

}