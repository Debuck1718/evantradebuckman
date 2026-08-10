export interface AuthenticatedIdentity {
  accountId: string;
  evantraId: string;
  sessionId: string;
  organizationIds: readonly string[];
  issuedAt: Date;
  expiresAt: Date;
}

export interface IdentityAuthenticationGateway {
  authenticateSession(sessionId: string): Promise<AuthenticatedIdentity>;
}

export interface WorkspaceAuthorizationContext {
  identity: AuthenticatedIdentity;
  organizationId?: string;
  requiredPermission?: string;
}

export interface WorkspaceAuthorizationPolicy {
  canAccess(context: WorkspaceAuthorizationContext): Promise<boolean>;
}
