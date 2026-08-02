/**
 * SQL queries for the
 * identity.browser_sessions table.
 */
export const BrowserSessionQueries = {

  // ==========================================================
  // Create
  // ==========================================================

  CREATE: `
    INSERT INTO identity.browser_sessions (

      id,

      session_id,
      account_id,
      evantra_id,
      client_id,
      application_id,
      organization_id,
      workspace_id,
      tenant_id,

      authentication_method,
      authentication_level,
      authenticated_at,
      mfa_verified,
      step_up_required,
      verified,

      device_id,
      fingerprint,
      device_name,
      device_type,
      operating_system,
      operating_system_version,
      browser,
      browser_version,
      platform,
      trusted,
      device_verified,
      last_seen_at,

      ip_address,
      forwarded_ip_address,
      country,
      region,
      city,
      internet_service_provider,
      autonomous_system_number,
      network_type,
      vpn_detected,
      proxy_detected,
      tor_detected,

      trust_level,
      remember_me,
      locked,
      continuous_validation,
      cookie_version,
      key_version,
      session_version,

      status,
      created_at,
      last_activity_at,
      idle_timeout_at,
      expires_at,
      revoked_at,
      terminated_at,
      updated_at

    )
    VALUES (

      $1,

      $2,$3,$4,$5,$6,$7,$8,$9,

      $10,$11,$12,$13,$14,$15,

      $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,

      $28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,

      $39,$40,$41,$42,$43,$44,$45,

      $46,$47,$48,$49,$50,$51,$52,$53

    )
  `,

  // ==========================================================
  // Update
  // ==========================================================

  UPDATE: `
    UPDATE identity.browser_sessions
       SET

         trust_level = $2,
         remember_me = $3,
         locked = $4,
         continuous_validation = $5,
         cookie_version = $6,
         key_version = $7,
         session_version = $8,

         mfa_verified = $9,
         step_up_required = $10,
         verified = $11,

         trusted = $12,
         device_verified = $13,
         fingerprint = $14,
         device_name = $15,
         last_seen_at = $16,

         ip_address = $17,
         forwarded_ip_address = $18,
         country = $19,
         region = $20,
         city = $21,
         internet_service_provider = $22,
         autonomous_system_number = $23,
         network_type = $24,
         vpn_detected = $25,
         proxy_detected = $26,
         tor_detected = $27,

         status = $28,
         last_activity_at = $29,
         idle_timeout_at = $30,
         expires_at = $31,
         revoked_at = $32,
         terminated_at = $33,
         updated_at = $34

     WHERE id = $1
  `,

  // ==========================================================
  // Delete
  // ==========================================================

  DELETE: `
    DELETE
      FROM identity.browser_sessions
     WHERE id = $1
  `,

  // ==========================================================
  // Find
  // ==========================================================

  FIND_BY_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE id = $1
  `,

  FIND_BY_SESSION_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE session_id = $1
  `,

  FIND_BY_ACCOUNT_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE account_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_EVANTRA_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE evantra_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_CLIENT_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE client_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_APPLICATION_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE application_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_ORGANIZATION_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE organization_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_WORKSPACE_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE workspace_id = $1
     ORDER BY created_at DESC
  `,

  FIND_BY_TENANT_ID: `
    SELECT *
      FROM identity.browser_sessions
     WHERE tenant_id = $1
     ORDER BY created_at DESC
  `,

};