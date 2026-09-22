/**
 * A parsed view of an incoming request's
 * User-Agent string.
 *
 * Every field is nullable because a client may
 * send a missing, truncated or deliberately
 * misleading User-Agent header. Callers must
 * treat null as "not determined" rather than
 * "unknown device".
 */
export interface UserAgentProfile {

  /**
   * Device category.
   */
  deviceType: string;

  /**
   * Derived device label.
   *
   * Example:
   * iPhone
   * Windows PC
   * Samsung Galaxy
   */
  deviceName: string | null;

  /**
   * Browser name.
   *
   * Example:
   * Chrome
   * Safari
   * Edge
   */
  browser: string | null;

  /**
   * Browser major version.
   *
   * Example:
   * 151
   */
  browserVersion: string | null;

  /**
   * Operating system name.
   *
   * Example:
   * Windows
   * iOS
   * Android
   */
  operatingSystem: string | null;

  /**
   * Operating system version.
   *
   * Example:
   * 11
   * 17.4
   */
  operatingSystemVersion: string | null;

  /**
   * Rendering platform.
   *
   * Example:
   * Windows
   * iOS
   * Android
   */
  platform: string | null;

  /**
   * True when the User-Agent could not be
   * analysed at all.
   */
  unrecognized: boolean;

}

/**
 * Detects client device, browser and
 * operating system details from a
 * User-Agent header.
 *
 * Implemented in-process with no third-party
 * dependency. A dedicated parser keeps the
 * authorization path free of external
 * supply-chain risk and avoids shipping a
 * large regular-expression table into the
 * authentication hot path.
 *
 * Detection is best effort. A client can send
 * any User-Agent it likes, so these values
 * describe what was claimed, not what was
 * verified. They are recorded for session
 * review and anomaly detection, never used as
 * an authorization decision.
 */
export interface UserAgentDetector {

  /**
   * Analyses a raw User-Agent header.
   */
  detect(
    userAgent: string | undefined | null,
  ): UserAgentProfile;

}