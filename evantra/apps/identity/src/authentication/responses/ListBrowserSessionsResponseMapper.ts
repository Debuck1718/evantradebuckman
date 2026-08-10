import {
  BrowserSession,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Browser Sessions
 * into HTTP responses.
 */
export class ListBrowserSessionsResponseMapper {

  static success(
    sessions: BrowserSession[],
  ): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        sessions:

          sessions.map(

            session => ({

              sessionId:

                session.identity.sessionId,

              accountId:

                session.identity.accountId,

              evantraId:

                session.identity
                  .evantraId
                  .value(),

              authenticated:

                session.authentication
                  .authenticatedAt,

              authenticatedAt:

                session.authentication
                  .authenticatedAt,

              trusted:

                session.device
                  .isTrusted(),

              locked:

                session.security
                  .isLocked(),

              expiresAt:

                session.lifecycle
                  .getExpiresAt(),

              idleTimeoutAt:

                session.lifecycle
                  .getIdleTimeoutAt(),

              createdAt:

                session.lifecycle
                  .getCreatedAt(),

              lastActivityAt:

                session.lifecycle
                  .lastActivity(),

              revokedAt:

                session.lifecycle
                  .getRevokedAt(),

              terminatedAt:

                session.lifecycle
                  .getTerminatedAt(),

              device: {

                deviceId:
                  session.device.deviceId,

                name:
                  session.device.getName(),

                type:
                  session.device.type,

                operatingSystem:
                  session.device.operatingSystem,

                operatingSystemVersion:
                  session.device.operatingSystemVersion,

                browser:
                  session.device.browser,

                browserVersion:
                  session.device.browserVersion,

                platform:
                  session.device.platform,

                trusted:
                  session.device.isTrusted(),

                verified:
                  session.device.isVerified(),

                lastSeenAt:
                  session.device.getLastSeenAt(),

              },

              network: {

                ipAddress:
                  session.network.ipAddress,

                forwardedIpAddress:
                  session.network.forwardedIpAddress,

                country:
                  session.network.country,

                region:
                  session.network.region,

                city:
                  session.network.city,

                internetServiceProvider:
                  session.network.internetServiceProvider,

                autonomousSystemNumber:
                  session.network.autonomousSystemNumber,

                networkType:
                  session.network.networkType,

                vpnDetected:
                  session.network.isVpn(),

                proxyDetected:
                  session.network.isProxy(),

                torDetected:
                  session.network.isTor(),

              },

              lifecycle: {

                status:
                  session.lifecycle.currentStatus(),

                revoked:
                  session.lifecycle.isRevoked(),

                terminated:
                  session.lifecycle.isTerminated(),

              },

            }),

          ),

      },

    };

  }

}