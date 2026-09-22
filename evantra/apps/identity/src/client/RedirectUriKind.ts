/**
 * The shape of an OAuth Redirect URI.
 *
 * Clients use this to decide how the
 * authorization code is delivered back
 * to them after the user consents.
 *
 * RFC6749 section 3.1.2
 * RFC8252 section 7
 */
export enum RedirectUriKind {

  /**
   * A browser-based application.
   *
   * Example:
   * https://app.example.com/oauth/callback
   *
   * The code arrives as a normal
   * browser navigation.
   */
  WEB = "WEB",

  /**
   * A loopback interface, typically a
   * native application or CLI tool
   * running a local HTTP listener.
   *
   * Example:
   * http://127.0.0.1:53682/callback
   *
   * The code arrives on the local
   * listener. HTTP is permitted here
   * even though the URI is not HTTPS
   * because traffic never leaves the
   * device.
   */
  LOOPBACK = "LOOPBACK",

  /**
   * A native application using a
   * reverse-DNS custom scheme.
   *
   * Example:
   * com.example.app://oauth/callback
   * myapp://oauth/callback
   *
   * The code arrives as a deep link
   * the operating system hands to the
   * application.
   */
  NATIVE = "NATIVE",

}