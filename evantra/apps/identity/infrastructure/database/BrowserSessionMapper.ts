import { BrowserSession } from "../../src/session/BrowserSession";

import { SessionIdentity } from "../../src/session/valueObjects/SessionIdentity";
import { SessionAuthentication } from "../../src/session/valueObjects/SessionAuthentication";
import { SessionDevice } from "../../src/session/valueObjects/SessionDevice";
import { SessionNetwork } from "../../src/session/valueObjects/SessionNetwork";
import { SessionSecurity } from "../../src/session/valueObjects/SessionSecurity";
import { SessionLifecycle } from "../../src/session/valueObjects/SessionLifecycle";

import { BrowserSessionRow } from "./BrowserSessionRow";
import { EnumMapper } from "./EnumMapper";

import { EvantraId } from "../../src/account";

import {
  AuthenticationMethod,
} from "../../src/session/enums/AuthenticationMethod";

import {
  AuthenticationLevel,
} from "../../src/session/enums/AuthenticationLevel";

import {
  DeviceType,
} from "../../src/session/enums/DeviceType";

import {
  NetworkType,
} from "../../src/session/enums/NetworkType";

import {
  SessionTrustLevel,
} from "../../src/session/enums/SessionTrustLevel";

import {
  SessionStatus,
} from "../../src/session/enums/SessionStatus";

/**
 * Maps Browser Sessions
 * between the domain model
 * and PostgreSQL.
 */
export class BrowserSessionMapper {

  /**
   * Converts a Browser Session
   * into a database row.
   */
  static toRow(
    session: BrowserSession,
  ): BrowserSessionRow {

    return {

      // ======================================================
      // Aggregate
      // ======================================================

      id: session.identity.sessionId,

      // ======================================================
      // Identity
      // ======================================================

      session_id: session.identity.sessionId,

      account_id: session.identity.accountId,

      evantra_id: session.identity.evantraId.value(),

      client_id: session.identity.clientId,

      application_id: session.identity.applicationId,

      organization_id: session.identity.organizationId,

      workspace_id: session.identity.workspaceId,

      tenant_id: session.identity.tenantId,

      // ======================================================
      // Authentication
      // ======================================================

      authentication_method:
        session.authentication.method,

      authentication_level:
        session.authentication.level,

      authenticated_at:
        session.authentication.authenticatedAt,

      mfa_verified:
        session.authentication.isMfaVerified(),

      step_up_required:
        session.authentication.requiresStepUp(),

      verified:
        session.authentication.isVerified(),

      // ======================================================
      // Device
      // ======================================================

      device_id:
        session.device.deviceId,

      fingerprint:
        session.device.getFingerprint(),

      device_name:
        session.device.getName(),

      device_type:
        session.device.type,

      operating_system:
        session.device.operatingSystem,

      operating_system_version:
        session.device.operatingSystemVersion,

      browser:
        session.device.browser,

      browser_version:
        session.device.browserVersion,

      platform:
        session.device.platform,

      trusted:
        session.device.isTrusted(),

      device_verified:
        session.device.isVerified(),

      last_seen_at:
        session.device.getLastSeenAt(),

      // ======================================================
      // Network
      // ======================================================

      ip_address:
        session.network.ipAddress,

      forwarded_ip_address:
        session.network.forwardedIpAddress,

      country:
        session.network.country,

      region:
        session.network.region,

      city:
        session.network.city,

      internet_service_provider:
        session.network.internetServiceProvider,

      autonomous_system_number:
        session.network.autonomousSystemNumber,

      network_type:
        session.network.networkType,

      vpn_detected:
        session.network.isVpn(),

      proxy_detected:
        session.network.isProxy(),

      tor_detected:
        session.network.isTor(),

      // ======================================================
      // Security
      // ======================================================

      trust_level:
        session.security.trust(),

      remember_me:
        session.security.remembers(),

      locked:
        session.security.isLocked(),

      continuous_validation:
        session.security.usesContinuousValidation(),

      cookie_version:
        session.security.cookieVersion,

      key_version:
        session.security.keyVersion,

      session_version:
        session.security.sessionVersion,

      // ======================================================
      // Lifecycle
      // ======================================================

      status:
        session.lifecycle.currentStatus(),

      created_at:
        session.lifecycle.getCreatedAt(),

      last_activity_at:
        session.lifecycle.lastActivity(),

      idle_timeout_at:
        session.lifecycle.getIdleTimeoutAt(),

      expires_at:
        session.lifecycle.getExpiresAt(),

      revoked_at:
        session.lifecycle.getRevokedAt(),

      terminated_at:
        session.lifecycle.getTerminatedAt(),

      updated_at:
        new Date(),

    };

  }

  /**
   * Restores a Browser Session
   * from a database row.
   */
  static toDomain(
    row: BrowserSessionRow,
  ): BrowserSession {

    return BrowserSession.restore({

      identity: SessionIdentity.restore({

        sessionId: row.session_id,

        accountId: row.account_id,

        evantraId: EvantraId.from(row.evantra_id),

        clientId: row.client_id,

        applicationId: row.application_id,

        organizationId: row.organization_id,

        workspaceId: row.workspace_id,

        tenantId: row.tenant_id,

      }),

      authentication: SessionAuthentication.restore({

        method: EnumMapper.restore(
          AuthenticationMethod,
          row.authentication_method,
          "authentication_method",
        ),

        level: EnumMapper.restore(
          AuthenticationLevel,
          row.authentication_level,
          "authentication_level",
        ),

        authenticatedAt:
          row.authenticated_at,

        mfaVerified:
          row.mfa_verified,

        stepUpRequired:
          row.step_up_required,

        verified:
          row.verified,

      }),

      device: SessionDevice.restore({

        deviceId:
          row.device_id,

        fingerprint:
          row.fingerprint,

        name:
          row.device_name,

        type: EnumMapper.restore(
          DeviceType,
          row.device_type,
          "device_type",
        ),

        operatingSystem:
          row.operating_system,

        operatingSystemVersion:
          row.operating_system_version,

        browser:
          row.browser,

        browserVersion:
          row.browser_version,

        platform:
          row.platform,

        trusted:
          row.trusted,

        verified:
          row.device_verified,

        lastSeenAt:
          row.last_seen_at,

      }),

      network: SessionNetwork.restore({

        ipAddress:
          row.ip_address,

        forwardedIpAddress:
          row.forwarded_ip_address,

        country:
          row.country,

        region:
          row.region,

        city:
          row.city,

        internetServiceProvider:
          row.internet_service_provider,

        autonomousSystemNumber:
          row.autonomous_system_number,

        networkType: EnumMapper.restore(
          NetworkType,
          row.network_type,
          "network_type",
        ),

        vpnDetected:
          row.vpn_detected,

        proxyDetected:
          row.proxy_detected,

        torDetected:
          row.tor_detected,

      }),

      security: SessionSecurity.restore({

        trustLevel: EnumMapper.restore(
          SessionTrustLevel,
          row.trust_level,
          "trust_level",
        ),

        rememberMe:
          row.remember_me,

        locked:
          row.locked,

        stepUpRequired:
          row.step_up_required,

        continuousValidation:
          row.continuous_validation,

        cookieVersion:
          row.cookie_version,

        keyVersion:
          row.key_version,

        sessionVersion:
          row.session_version,

      }),

      lifecycle: SessionLifecycle.restore({

        createdAt:
          row.created_at,

        lastActivityAt:
          row.last_activity_at,

        expiresAt:
          row.expires_at,

        idleTimeoutAt:
          row.idle_timeout_at,

        revokedAt:
          row.revoked_at,

        terminatedAt:
          row.terminated_at,

        status: EnumMapper.restore(
          SessionStatus,
          row.status,
          "status",
        ),

      }),

    });

  }

}