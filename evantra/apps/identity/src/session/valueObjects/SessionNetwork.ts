import {
  NetworkType,
} from "../enums/NetworkType";

/**
 * Represents the network
 * environment of a Browser
 * Session.
 */
export class SessionNetwork {

  private constructor(

    /**
     * Public IP address.
     */
    public readonly ipAddress: string,

    /**
     * Forwarded IP address.
     */
    public readonly forwardedIpAddress: string | null,

    /**
     * Country.
     */
    public readonly country: string | null,

    /**
     * Region / State.
     */
    public readonly region: string | null,

    /**
     * City.
     */
    public readonly city: string | null,

    /**
     * Internet Service Provider.
     */
    public readonly internetServiceProvider: string | null,

    /**
     * Autonomous System Number.
     */
    public readonly autonomousSystemNumber: string | null,

    /**
     * Connection type.
     */
    public readonly networkType: NetworkType,

    /**
     * VPN detected.
     */
    private vpnDetected: boolean,

    /**
     * Proxy detected.
     */
    private proxyDetected: boolean,

    /**
     * Tor detected.
     */
    private torDetected: boolean,

  ) {}

  /**
   * Creates a Session Network.
   */
  static create(params: {

    ipAddress: string;

    forwardedIpAddress?: string | null;

    country?: string | null;

    region?: string | null;

    city?: string | null;

    internetServiceProvider?: string | null;

    autonomousSystemNumber?: string | null;

    networkType: NetworkType;

    vpnDetected?: boolean;

    proxyDetected?: boolean;

    torDetected?: boolean;

  }): SessionNetwork {

    return new SessionNetwork(

      params.ipAddress,

      params.forwardedIpAddress ?? null,

      params.country ?? null,

      params.region ?? null,

      params.city ?? null,

      params.internetServiceProvider ?? null,

      params.autonomousSystemNumber ?? null,

      params.networkType,

      params.vpnDetected ?? false,

      params.proxyDetected ?? false,

      params.torDetected ?? false,

    );

  }

  /**
   * Restores a persisted
   * Session Network.
   */
  static restore(params: {

    ipAddress: string;

    forwardedIpAddress: string | null;

    country: string | null;

    region: string | null;

    city: string | null;

    internetServiceProvider: string | null;

    autonomousSystemNumber: string | null;

    networkType: NetworkType;

    vpnDetected: boolean;

    proxyDetected: boolean;

    torDetected: boolean;

  }): SessionNetwork {

    return new SessionNetwork(

      params.ipAddress,

      params.forwardedIpAddress,

      params.country,

      params.region,

      params.city,

      params.internetServiceProvider,

      params.autonomousSystemNumber,

      params.networkType,

      params.vpnDetected,

      params.proxyDetected,

      params.torDetected,

    );

  }

  /**
   * Returns true when
   * a VPN was detected.
   */
  isVpn(): boolean {

    return this.vpnDetected;

  }

  /**
   * Returns true when
   * a proxy was detected.
   */
  isProxy(): boolean {

    return this.proxyDetected;

  }

  /**
   * Returns true when
   * Tor was detected.
   */
  isTor(): boolean {

    return this.torDetected;

  }

  /**
   * Returns true when
   * the supplied IP matches.
   */
  matchesIpAddress(
    ipAddress: string,
  ): boolean {

    return this.ipAddress ===
      ipAddress;

  }

}