export interface WorkspaceFeatureFlags {
  calendar: boolean;
  tasks: boolean;
  planning: boolean;
  goals: boolean;
  collaboration: boolean;
  knowledge: boolean;
  notifications: boolean;
  files: boolean;
  finance: boolean;
  vault: boolean;
  dashboard: boolean;
  assistant: boolean;
}

export interface WorkspaceBranding {
  workspaceName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
}

export interface WorkspaceSecurityPolicy {
  enforceMfa: boolean;
  sessionMaxHours: number;
  allowedIpRanges: readonly string[];
}

export interface WorkspaceConfig {
  features: WorkspaceFeatureFlags;
  branding: WorkspaceBranding;
  security: WorkspaceSecurityPolicy;
  timezone: string;
  locale: string;
}
