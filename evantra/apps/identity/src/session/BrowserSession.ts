import {
  SessionIdentity,
} from "./valueObjects/SessionIdentity";

import {
  SessionAuthentication,
} from "./valueObjects/SessionAuthentication";

import {
  SessionDevice,
} from "./valueObjects/SessionDevice";

import {
  SessionNetwork,
} from "./valueObjects/SessionNetwork";

import {
  SessionSecurity,
} from "./valueObjects/SessionSecurity";

import {
  SessionLifecycle,
} from "./valueObjects/SessionLifecycle";

import {
  EvantraId,
} from "../account";

/**
 * Represents an authenticated
 * browser session.
 *
 * This is the aggregate root
 * of the Session module.
 */
export class BrowserSession {

  private constructor(

    public readonly identity:
      SessionIdentity,

    public readonly authentication:
      SessionAuthentication,

    public readonly device:
      SessionDevice,

    public readonly network:
      SessionNetwork,

    public readonly security:
      SessionSecurity,

    public readonly lifecycle:
      SessionLifecycle,

  ) {}

  /**
   * Creates a new
   * Browser Session.
   */
  static create(params: {

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): BrowserSession {

    return new BrowserSession(

      params.identity,

      params.authentication,

      params.device,

      params.network,

      params.security,

      params.lifecycle,

    );

  }

  /**
   * Restores a persisted
   * Browser Session.
   */
  static restore(params: {

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): BrowserSession {

    return new BrowserSession(

      params.identity,

      params.authentication,

      params.device,

      params.network,

      params.security,

      params.lifecycle,

    );

  }

  /**
   * Updates session activity.
   */
  touch(
    idleTimeoutAt: Date,
  ): void {

    this.lifecycle.touch(
      idleTimeoutAt,
    );

    this.device.touch();

  }

  /**
   * Revokes the session.
   */
  revoke(): void {

    this.lifecycle.revoke();

  }

  /**
   * Terminates the session.
   */
  terminate(): void {

    this.lifecycle.terminate();

  }

  /**
   * Locks the session.
   */
  lock(): void {

    this.security.lock();

  }

  /**
   * Unlocks the session.
   */
  unlock(): void {

    this.security.unlock();

  }

  /**
   * Marks the device
   * as trusted.
   */
  trustDevice(): void {

    this.device.markTrusted();

  }

  /**
   * Removes device trust.
   */
  revokeDeviceTrust(): void {

    this.device.revokeTrust();

  }

  /**
   * Requires step-up
   * authentication.
   */
  requireStepUp(): void {

    this.authentication.requireStepUp();

    this.security.requireStepUp();

  }

  /**
   * Clears step-up
   * authentication.
   */
  completeStepUp(): void {

    this.authentication.clearStepUp();

    this.authentication.verify();

    this.security.clearStepUp();

  }

  /**
   * Completes MFA.
   */
  verifyMfa(): void {

    this.authentication.verifyMfa();

  }

    /**
   * Creates a replacement
   * Browser Session.
   *
   * Used during Session
   * Rotation to prevent
   * session fixation attacks.
   */
  rotate(params: {

    sessionId: string;

    authenticatedAt: Date;

    expiresAt: Date;

    idleTimeoutAt: Date;

  }): BrowserSession {

    return BrowserSession.create({

      identity:

        SessionIdentity.create({

          sessionId:

            params.sessionId,

          accountId:

            this.identity.accountId,

          evantraId:

            this.identity.evantraId,

          clientId:

            this.identity.clientId,

          applicationId:

            this.identity.applicationId,

          organizationId:

            this.identity.organizationId,

          workspaceId:

            this.identity.workspaceId,

          tenantId:

            this.identity.tenantId,

        }),

      authentication:

        SessionAuthentication.create({

          method:

            this.authentication.method,

          level:

            this.authentication.level,

          authenticatedAt:

            params.authenticatedAt,

          mfaVerified:

            this.authentication.isMfaVerified(),

          stepUpRequired:

            false,

          verified:

            this.authentication.isVerified(),

        }),

      device:

        SessionDevice.restore({

          deviceId:

            this.device.deviceId,

          fingerprint:

            this.device.getFingerprint(),

          name:

            this.device.getName(),

          type:

            this.device.type,

          operatingSystem:

            this.device.operatingSystem,

          operatingSystemVersion:

            this.device.operatingSystemVersion,

          browser:

            this.device.browser,

          browserVersion:

            this.device.browserVersion,

          platform:

            this.device.platform,

          trusted:

            this.device.isTrusted(),

          verified:

            this.device.isVerified(),

          lastSeenAt:

            params.authenticatedAt,

        }),

      network:

        SessionNetwork.create({

          ipAddress:

            this.network.ipAddress,

          forwardedIpAddress:

            this.network.forwardedIpAddress,

          country:

            this.network.country,

          region:

            this.network.region,

          city:

            this.network.city,

          internetServiceProvider:

            this.network.internetServiceProvider,

          autonomousSystemNumber:

            this.network.autonomousSystemNumber,

          networkType:

            this.network.networkType,

          vpnDetected:

            this.network.isVpn(),

          proxyDetected:

            this.network.isProxy(),

          torDetected:

            this.network.isTor(),

        }),

      security:

        SessionSecurity.create({

          trustLevel:

            this.security.trust(),

          rememberMe:

            this.security.remembers(),

          continuousValidation:

            this.security.usesContinuousValidation(),

          cookieVersion:

            this.security.cookieVersion,

          keyVersion:

            this.security.keyVersion,

          sessionVersion:

            this.security.sessionVersion,

        }),

      lifecycle:

        SessionLifecycle.create({

          expiresAt:

            params.expiresAt,

          idleTimeoutAt:

            params.idleTimeoutAt,

        }),

    });

  }

  /**
   * Returns true if the
   * Browser Session can
   * be used.
   */
  isActive(): boolean {

    return (

      this.lifecycle.isActive()

      &&

      !this.security.isLocked()

    );

  }

  /**
   * Returns true when
   * step-up authentication
   * is required.
   */
  requiresStepUp(): boolean {

    return (

      this.authentication.requiresStepUp()

      ||

      this.security.requiresStepUp()

    );

  }

  /**
   * Returns true when the
   * Browser Session belongs
   * to an Evantra.
   */
  belongsToEvantraId(
  evantraId: EvantraId,
): boolean {

  return this.identity
    .belongsToEvantraId(
      evantraId,
    );

}

static async findByAccountId(
  repository: {
    findByAccountId(accountId: string): Promise<BrowserSession[]>;
  },
  accountId: string,
): Promise<BrowserSession[]> {

  return repository.findByAccountId(
    accountId,
  );

}

}