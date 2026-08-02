/**
 * Represents a row from
 * identity.browser_sessions.
 *
 * This is a persistence model.
 */
export interface BrowserSessionRow {

  // ==========================================================
  // Aggregate
  // ==========================================================

  id: string;

  // ==========================================================
  // SessionIdentity
  // ==========================================================

  session_id: string;

  account_id: string;

  evantra_id: string;

  client_id: string | null;

  application_id: string | null;

  organization_id: string | null;

  workspace_id: string | null;

  tenant_id: string | null;

  // ==========================================================
  // SessionAuthentication
  // ==========================================================

  authentication_method: string;

  authentication_level: string;

  authenticated_at: Date;

  mfa_verified: boolean;

  step_up_required: boolean;

  verified: boolean;

  // ==========================================================
  // SessionDevice
  // ==========================================================

  device_id: string;

  fingerprint: string;

  device_name: string;

  device_type: string;

  operating_system: string;

  operating_system_version: string;

  browser: string;

  browser_version: string;

  platform: string;

  trusted: boolean;

  device_verified: boolean;

  last_seen_at: Date;

  // ==========================================================
  // SessionNetwork
  // ==========================================================

  ip_address: string;

  forwarded_ip_address: string | null;

  country: string | null;

  region: string | null;

  city: string | null;

  internet_service_provider: string | null;

  autonomous_system_number: string | null;

  network_type: string;

  vpn_detected: boolean;

  proxy_detected: boolean;

  tor_detected: boolean;

  // ==========================================================
  // SessionSecurity
  // ==========================================================

  trust_level: string;

  remember_me: boolean;

  locked: boolean;

  continuous_validation: boolean;

  cookie_version: number;

  key_version: number;

  session_version: number;

  // ==========================================================
  // SessionLifecycle
  // ==========================================================

  status: string;

  created_at: Date;

  last_activity_at: Date;

  idle_timeout_at: Date;

  expires_at: Date;

  revoked_at: Date | null;

  terminated_at: Date | null;

  updated_at: Date;

}