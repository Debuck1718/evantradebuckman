import {
  DeviceType,
} from "../../session/enums";

/**
 * Represents the device
 * used during authentication.
 *
 * This is an immutable snapshot
 * captured from the incoming request.
 */
export class AuthenticationDevice {

  private constructor(

    /**
     * Device identifier.
     */
    public readonly deviceId: string | null,

    /**
     * Device fingerprint.
     */
    public readonly fingerprint: string | null,

    /**
     * Friendly device name.
     */
    public readonly name: string | null,

   /**
 * Device type.
 */
public readonly type:
  DeviceType,

    /**
     * Browser.
     */
    public readonly browser: string | null,

    /**
     * Browser version.
     */
    public readonly browserVersion: string | null,

    /**
     * Operating System.
     */
    public readonly operatingSystem: string | null,

    /**
     * Operating System version.
     */
    public readonly operatingSystemVersion: string | null,

    /**
     * Platform.
     */
    public readonly platform: string | null,

  ) {}

  /**
   * Creates an Authentication Device.
   */
  static create(params: {

  deviceId?: string | null;

  fingerprint?: string | null;

  name?: string | null;

  type: DeviceType;

  browser?: string | null;

  browserVersion?: string | null;

  operatingSystem?: string | null;

  operatingSystemVersion?: string | null;

  platform?: string | null;

}): AuthenticationDevice {

    return new AuthenticationDevice(

      params.deviceId ?? null,

      params.fingerprint ?? null,

      params.name ?? null,

      params.type,

      params.browser ?? null,

      params.browserVersion ?? null,

      params.operatingSystem ?? null,

      params.operatingSystemVersion ?? null,

      params.platform ?? null,

    );

  }

}