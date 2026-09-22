import {
  RedirectUriKind,
} from "./RedirectUriKind";

/**
 * Represents an OAuth
 * Redirect URI.
 *
 * Redirect URIs are validated
 * before participating in
 * authorization flows.
 *
 * Three shapes are supported:
 *
 * 1. Web
 *    https://app.example.com/oauth/callback
 *
 * 2. Loopback / development
 *    http://localhost:3000/oauth/callback
 *    http://127.0.0.1:3000/oauth/callback
 *
 * 3. Native mobile
 *    com.example.app://oauth/callback
 *    myapp://oauth/callback
 *
 * RFC6749 section 3.1.2
 * RFC8252 section 7.1
 */
export class RedirectUri {

  private constructor(
    private readonly uri: string,
    private readonly kind: RedirectUriKind,
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

    /*
     * Native mobile redirect URIs use a
     * reverse-DNS custom scheme, which
     * the URL parser handles fine, but
     * the RFC8252 forbids fragments on
     * every redirect URI shape.
     */
    if (normalized.includes("#")) {
      throw new Error(
        "Redirect URI must not contain a fragment."
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

    const isLoopback =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1";

    /*
     * Loopback redirects are how native
     * apps and CLI tools receive the
     * authorization code without an
     * external browser tab.
     *
     * RFC8252 section 7.3 explicitly
     * permits http on loopback addresses
     * even though the URI is not https.
     */
    if (isLoopback) {

      if (
        parsed.protocol !== "http:" &&
        parsed.protocol !== "https:"
      ) {

        throw new Error(
          "Loopback redirect URI must use http or https."
        );

      }

      return new RedirectUri(
        parsed.toString(),
        RedirectUriKind.LOOPBACK,
      );

    }

    if (parsed.protocol === "https:") {

      return new RedirectUri(
        parsed.toString(),
        RedirectUriKind.WEB,
      );

    }

    /*
     * Any other scheme is a native
     * custom scheme, for example
     * com.example.app://callback.
     *
     * Plain http is rejected for
     * non-loopback hosts so a code can
     * never travel in clear text.
     */
    if (parsed.protocol === "http:") {

      throw new Error(
        "Redirect URI must use HTTPS."
      );

    }

    return new RedirectUri(
      parsed.toString(),
      RedirectUriKind.NATIVE,
    );

  }

  /**
   * Returns the raw URI.
   */
  value(): string {

    return this.uri;

  }

  /**
   * Returns the redirect URI shape.
   *
   * Clients use this to decide how to
   * capture the authorization code:
   * a browser navigation for web, a
   * deep link or loopback listener for
   * native applications.
   */
  type(): RedirectUriKind {

    return this.kind;

  }

  /**
   * True when the URI targets a native
   * application rather than a web
   * application.
   */
  isNative(): boolean {

    return this.kind === RedirectUriKind.NATIVE;

  }

  /**
   * True when the URI targets a loopback
   * interface for development or native
   * code capture.
   */
  isLoopback(): boolean {

    return this.kind === RedirectUriKind.LOOPBACK;

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