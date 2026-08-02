import {
  Account,
} from "../account";

import {
  AuthenticationContext,
} from "../authentication/context";

import {
  AuthenticationLevel,
  AuthenticationMethod,
  MfaMethod,
} from "./enums";

import {
  BrowserSession,
} from "./BrowserSession";

import {
  SessionAuthentication,
} from "./valueObjects/SessionAuthentication";

import {
  SessionDevice,
} from "./valueObjects/SessionDevice";

import {
  SessionIdentity,
} from "./valueObjects/SessionIdentity";

import {
  SessionLifecycle,
} from "./valueObjects/SessionLifecycle";

import {
  SessionNetwork,
} from "./valueObjects/SessionNetwork";

import {
  SessionSecurity,
} from "./valueObjects/SessionSecurity";

/**
 * Creates Browser Sessions.
 *
 * This factory converts an
 * Authentication Context into
 * a Browser Session aggregate.
 */
export class BrowserSessionFactory {

  /**
   * Creates a Browser Session.
   */
  static create(params: {

    account: Account;

    sessionId: string;

    context: AuthenticationContext;

    expiresAt: Date;

    idleTimeoutAt: Date;

  }): BrowserSession {

    const identity =
      SessionIdentity.create({

        sessionId:
          params.sessionId,

        accountId:
          params.account.id,

        evantraId:
          params.account.evantraId,

        clientId:
          params.context.client.clientId,

        applicationId:
          params.context.client.applicationId,

        organizationId:
          params.context.client.organizationId,

        workspaceId:
          params.context.client.workspaceId,

        tenantId:
          params.context.client.tenantId,

      });

    const authentication =
      SessionAuthentication.create({

        method:
          params.context.details.method,

        level:
          params.context.details.level,

        mfaVerified:
          params.context.details.mfaMethod !==
          MfaMethod.NONE,

        stepUpRequired:
          params.context.details.stepUp,

      });

    const device =
      SessionDevice.create({

        deviceId:
          params.context.device.deviceId ??
          crypto.randomUUID(),

        fingerprint:
          params.context.device.fingerprint ??
          "",

        name:
          params.context.device.name ??
          "Unknown Device",

        type:
          params.context.device.type,

        operatingSystem:
          params.context.device.operatingSystem ??
          "Unknown",

        operatingSystemVersion:
          params.context.device.operatingSystemVersion ??
          "",

        browser:
          params.context.device.browser ??
          "Unknown",

        browserVersion:
          params.context.device.browserVersion ??
          "",

        platform:
          params.context.device.platform ??
          "Unknown",

      });

    const network =
      SessionNetwork.create({

        ipAddress:
          params.context.network.ipAddress,

        forwardedIpAddress:
          params.context.network.forwardedIpAddress,

        country:
          params.context.network.country,

        region:
          params.context.network.region,

        city:
          params.context.network.city,

        internetServiceProvider:
          params.context.network.internetServiceProvider,

        autonomousSystemNumber:
          params.context.network.autonomousSystemNumber,

        networkType:
          params.context.network.networkType,

        vpnDetected:
          params.context.network.vpnDetected,

        proxyDetected:
          params.context.network.proxyDetected,

        torDetected:
          params.context.network.torDetected,

      });

    const security =
      SessionSecurity.create({

        rememberMe:
          params.context.details.rememberMe,

      });

    const lifecycle =
      SessionLifecycle.create({

        expiresAt:
          params.expiresAt,

        idleTimeoutAt:
          params.idleTimeoutAt,

      });

    return BrowserSession.create({

      identity,

      authentication,

      device,

      network,

      security,

      lifecycle,

    });

  }

}