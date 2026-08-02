import {
  DeviceType,
} from "../enums/DeviceType";

/**
 * Represents the device
 * participating in a
 * Browser Session.
 */
export class SessionDevice {

  private constructor(

    /**
     * Device identifier.
     */
    public readonly deviceId: string,

    /**
     * Device fingerprint.
     */
    private fingerprint: string,

    /**
     * Friendly device name.
     */
    private name: string,

    /**
     * Device category.
     */
    public readonly type: DeviceType,

    /**
     * Operating System.
     */
    public readonly operatingSystem: string,

    /**
     * Operating System version.
     */
    public readonly operatingSystemVersion: string,

    /**
     * Browser.
     */
    public readonly browser: string,

    /**
     * Browser version.
     */
    public readonly browserVersion: string,

    /**
     * Platform.
     */
    public readonly platform: string,

    /**
     * Trusted device.
     */
    private trusted: boolean,

    /**
     * Verified device.
     */
    private verified: boolean,

    /**
     * Last activity.
     */
    private lastSeenAt: Date,

  ) {}

  /**
   * Creates a new Session Device.
   */
  static create(params: {

    deviceId: string;

    fingerprint: string;

    name: string;

    type: DeviceType;

    operatingSystem: string;

    operatingSystemVersion: string;

    browser: string;

    browserVersion: string;

    platform: string;

  }): SessionDevice {

    return new SessionDevice(

      params.deviceId,

      params.fingerprint,

      params.name,

      params.type,

      params.operatingSystem,

      params.operatingSystemVersion,

      params.browser,

      params.browserVersion,

      params.platform,

      false,

      false,

      new Date(),

    );

  }

  /**
   * Restores a persisted device.
   */
  static restore(params: {

    deviceId: string;

    fingerprint: string;

    name: string;

    type: DeviceType;

    operatingSystem: string;

    operatingSystemVersion: string;

    browser: string;

    browserVersion: string;

    platform: string;

    trusted: boolean;

    verified: boolean;

    lastSeenAt: Date;

  }): SessionDevice {

    return new SessionDevice(

      params.deviceId,

      params.fingerprint,

      params.name,

      params.type,

      params.operatingSystem,

      params.operatingSystemVersion,

      params.browser,

      params.browserVersion,

      params.platform,

      params.trusted,

      params.verified,

      new Date(params.lastSeenAt),

    );

  }

  // ==========================================================
  // Identity
  // ==========================================================


  /**
 * Returns the device fingerprint.
 */
getFingerprint(): string {

    return this.fingerprint;

}

  /**
 * Returns the friendly
 * device name.
 */
getName(): string {

    return this.name;

}

  /**
 * Returns the last time
 * the device was seen.
 */
getLastSeenAt(): Date {

    return new Date(

        this.lastSeenAt,

    );

}

  // ==========================================================
  // Trust
  // ==========================================================

  /**
   * Marks the device as trusted.
   */
  markTrusted(): void {

    this.trusted = true;

  }

  /**
   * Removes trusted status.
   */
  revokeTrust(): void {

    this.trusted = false;

  }

  /**
   * Returns true if trusted.
   */
  isTrusted(): boolean {

    return this.trusted;

  }

  // ==========================================================
  // Verification
  // ==========================================================

  /**
   * Marks the device as verified.
   */
  verify(): void {

    this.verified = true;

  }

  /**
   * Returns true if verified.
   */
  isVerified(): boolean {

    return this.verified;

  }

  // ==========================================================
  // Updates
  // ==========================================================

  /**
   * Updates the friendly name.
   */
  rename(
    name: string,
  ): void {

    this.name =
      name.trim();

  }

  /**
   * Updates the last activity time.
   */
  touch(): void {

    this.lastSeenAt =
      new Date();

  }

  /**
   * Replaces the fingerprint.
   */
  updateFingerprint(
    fingerprint: string,
  ): void {

    this.fingerprint =
      fingerprint;

  }

  // ==========================================================
  // Comparisons
  // ==========================================================

  /**
   * Returns true if the supplied
   * fingerprint matches.
   */
  matchesFingerprint(
    fingerprint: string,
  ): boolean {

    return this.fingerprint ===
      fingerprint;

  }

  /**
   * Returns true if this is
   * a desktop device.
   */
  isDesktop(): boolean {

    return this.type ===
      DeviceType.DESKTOP;

  }

  /**
   * Returns true if this is
   * a laptop.
   */
  isLaptop(): boolean {

    return this.type ===
      DeviceType.LAPTOP;

  }

  /**
   * Returns true if this is
   * a mobile device.
   */
  isMobile(): boolean {

    return this.type ===
      DeviceType.MOBILE;

  }

  /**
   * Returns true if this is
   * a tablet.
   */
  isTablet(): boolean {

    return this.type ===
      DeviceType.TABLET;

  }

  /**
   * Returns true if this is
   * an IoT device.
   */
  isIoT(): boolean {

    return this.type ===
      DeviceType.IOT;

  }

  /**
   * Returns true if this is
   * a server.
   */
  isServer(): boolean {

    return this.type ===
      DeviceType.SERVER;

  }

}