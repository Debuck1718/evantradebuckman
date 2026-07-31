import { ClientId } from "./ClientId";
import { ClientStatus } from "./ClientStatus";

/**
 * Represents an OAuth Client
 * registered with Evantra Identity.
 *
 * A Client represents an application
 * trusted to participate in OAuth
 * and OpenID Connect flows.
 */
export class Client {

  /**
   * Creates a Client.
   */
  private constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * Owner account.
     */
    public readonly ownerAccountId: string,

    /**
     * Public OAuth Client ID.
     */
    public readonly clientId: ClientId,

    /**
     * Client Secret hash.
     */
    private clientSecretHash: string,

    /**
     * Display name.
     */
    public readonly name: string,

    /**
     * URL-friendly slug.
     */
    public readonly slug: string,

    /**
     * Application homepage.
     */
    public readonly homepageUrl: string | null,

    /**
     * Application description.
     */
    public readonly description: string | null,

    /**
     * Evantra-owned application?
     */
    public readonly firstParty: boolean,

    /**
     * Lifecycle status.
     */
    private status: ClientStatus,

    /**
     * Secret version.
     */
    private secretVersion: number,

    /**
     * Secret rotation timestamp.
     */
    private secretLastRotatedAt: Date | null,

    /**
     * Secret expiration.
     */
    private secretExpiresAt: Date | null,

    /**
     * Secret revocation.
     */
    private secretRevokedAt: Date | null,

    /**
     * Creation time.
     */
    public readonly createdAt: Date,

    /**
     * Last modification.
     */
    private updatedAt: Date

  ) {}

  /**
   * Registers a new OAuth Client.
   */
  static create(params: {

    id: string;

    ownerAccountId: string;

    clientId: ClientId;

    clientSecretHash: string;

    name: string;

    slug: string;

    homepageUrl?: string | null;

    description?: string | null;

    firstParty?: boolean;

  }): Client {

    const now = new Date();

    return new Client(

      params.id,

      params.ownerAccountId,

      params.clientId,

      params.clientSecretHash,

      params.name.trim(),

      params.slug.trim().toLowerCase(),

      params.homepageUrl ?? null,

      params.description ?? null,

      params.firstParty ?? false,

      ClientStatus.PENDING_APPROVAL,

      1,

      now,

      null,

      null,

      now,

      now

    );

  }

  /**
   * Restores a persisted Client.
   */
  static restore(params: {

    id: string;

    ownerAccountId: string;

    clientId: ClientId;

    clientSecretHash: string;

    name: string;

    slug: string;

    homepageUrl: string | null;

    description: string | null;

    firstParty: boolean;

    status: ClientStatus;

    secretVersion: number;

    secretLastRotatedAt: Date | null;

    secretExpiresAt: Date | null;

    secretRevokedAt: Date | null;

    createdAt: Date;

    updatedAt: Date;

  }): Client {

    return new Client(

      params.id,

      params.ownerAccountId,

      params.clientId,

      params.clientSecretHash,

      params.name,

      params.slug,

      params.homepageUrl,

      params.description,

      params.firstParty,

      params.status,

      params.secretVersion,

      params.secretLastRotatedAt,

      params.secretExpiresAt,

      params.secretRevokedAt,

      new Date(params.createdAt),

      new Date(params.updatedAt)

    );

  }

  /**
   * Returns the Client status.
   */
  getStatus(): ClientStatus {

    return this.status;

  }

  /**
   * Returns the stored secret hash.
   */
  secretHash(): string {

    return this.clientSecretHash;

  }

  /**
   * Returns the secret version.
   */
  getSecretVersion(): number {

    return this.secretVersion;

  }

  getSecretLastRotatedAt(): Date | null {
  return this.secretLastRotatedAt;
}

getSecretExpiresAt(): Date | null {
  return this.secretExpiresAt;
}

getSecretRevokedAt(): Date | null {
  return this.secretRevokedAt;
}

  /**
   * Returns true if the client
   * is active.
   */
  isActive(): boolean {

    return this.status === ClientStatus.ACTIVE;

  }

  /**
   * Approves the client.
   */
  approve(): void {

    if (
      this.status === ClientStatus.REVOKED
    ) {
      throw new Error(
        "Revoked clients cannot be approved."
      );
    }

    this.status =
      ClientStatus.ACTIVE;

    this.touch();

  }

  /**
   * Disables the client.
   */
  disable(): void {

    if (
      this.status === ClientStatus.REVOKED
    ) {
      throw new Error(
        "Revoked clients cannot be disabled."
      );
    }

    this.status =
      ClientStatus.DISABLED;

    this.touch();

  }

  /**
   * Revokes the client.
   */
  revoke(): void {

    this.status =
      ClientStatus.REVOKED;

    this.secretRevokedAt =
      new Date();

    this.touch();

  }

  /**
   * Rotates the client secret.
   */
  rotateSecret(
    newSecretHash: string,
    expiresAt: Date | null
  ): void {

    this.clientSecretHash =
      newSecretHash;

    this.secretVersion++;

    this.secretLastRotatedAt =
      new Date();

    this.secretExpiresAt =
      expiresAt;

    this.secretRevokedAt =
      null;

    this.touch();

  }

  /**
   * Returns the last update time.
   */
  updated(): Date {

    return this.updatedAt;

  }

  /**
   * Updates the modification time.
   */
  private touch(): void {

    this.updatedAt =
      new Date();

  }

}