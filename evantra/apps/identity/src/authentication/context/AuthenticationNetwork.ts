import {
  NetworkType,
} from "../../session/enums/NetworkType";

/**
 * Represents the network
 * environment during an
 * authentication request.
 *
 * This is an immutable snapshot
 * captured from the incoming request.
 */
export class AuthenticationNetwork {

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
     * Network type.
     */
    public readonly networkType: NetworkType,

    /**
     * VPN detected.
     */
    public readonly vpnDetected: boolean,

    /**
     * Proxy detected.
     */
    public readonly proxyDetected: boolean,

    /**
     * Tor detected.
     */
    public readonly torDetected: boolean,

  ) {}

  /**
   * Creates an Authentication
   * Network snapshot.
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

  }): AuthenticationNetwork {

    return new AuthenticationNetwork(

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

}