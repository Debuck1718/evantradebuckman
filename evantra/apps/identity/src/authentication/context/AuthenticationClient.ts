/**
 * Represents the application
 * requesting authentication.
 *
 * This is an immutable snapshot
 * captured during authentication.
 */
export class AuthenticationClient {

  private constructor(

    /**
     * OAuth Client.
     */
    public readonly clientId: string | null,

    /**
     * Application.
     */
    public readonly applicationId: string | null,

    /**
     * Organization.
     */
    public readonly organizationId: string | null,

    /**
     * Workspace.
     */
    public readonly workspaceId: string | null,

    /**
     * Tenant.
     */
    public readonly tenantId: string | null,

  ) {}

  /**
   * Creates an Authentication
   * Client context.
   */
  static create(params: {

    clientId?: string | null;

    applicationId?: string | null;

    organizationId?: string | null;

    workspaceId?: string | null;

    tenantId?: string | null;

  }): AuthenticationClient {

    return new AuthenticationClient(

      params.clientId ?? null,

      params.applicationId ?? null,

      params.organizationId ?? null,

      params.workspaceId ?? null,

      params.tenantId ?? null,

    );

  }

}