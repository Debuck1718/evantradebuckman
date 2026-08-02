import {
  EvantraId,
} from "../../account";

/**
 * Identifies the owner of a
 * Browser Session.
 */
export class SessionIdentity {

  private constructor(

    /**
     * Internal Browser Session record.
     */
    public readonly sessionId: string,

    /**
     * Internal Account identifier.
     */
    public readonly accountId: string,

    /**
     * Public Evantra Identity.
     */
    public readonly evantraId: EvantraId,

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
 * Restores a persisted
 * Session Identity.
 */
static restore(params: {

  sessionId: string;

  accountId: string;

  evantraId: EvantraId;

  clientId: string | null;

  applicationId: string | null;

  organizationId: string | null;

  workspaceId: string | null;

  tenantId: string | null;

}): SessionIdentity {

  return new SessionIdentity(

    params.sessionId,

    params.accountId,

    params.evantraId,

    params.clientId,

    params.applicationId,

    params.organizationId,

    params.workspaceId,

    params.tenantId,

  );

}

  belongsToAccount(
    accountId: string,
  ): boolean {

    return this.accountId ===
      accountId;

  }

  belongsToEvantraId(
    evantraId: EvantraId,
  ): boolean {

    return this.evantraId.equals(
      evantraId,
    );

  }

}