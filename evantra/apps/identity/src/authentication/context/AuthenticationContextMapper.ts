import {
  AuthenticationClient,
} from "./AuthenticationClient";
import {
  AuthenticationContext,
} from "./AuthenticationContext";

import {
  AuthenticationDetails,
} from "./AuthenticationDetails";

import {
  AuthenticationDevice,
} from "./AuthenticationDevice";

import {
  AuthenticationNetwork,
} from "./AuthenticationNetwork";

import {
  AuthenticationLevel,
  AuthenticationMethod,
  DeviceType,
  MfaMethod,
  NetworkType,
} from "../../session/enums";

import {
  HttpRequest,
} from "../../http";

import {
  DetectClientDevice,
} from "../../platform/DetectClientDevice";

import {
  type UserAgentProfile,
} from "../../platform/UserAgentDetector";

/**
 * Shared, stateless parser.
 *
 * Detecting the device is pure string work
 * with no per-request state, so one instance
 * is reused for every authentication. This
 * keeps the hot path free of object churn.
 */
const deviceDetector =
  new DetectClientDevice();

/**
 * Body expected by the
 * Authenticate endpoint.
 *
 * Additional fields can be added
 * without changing the mapper.
 */
import {
  AuthenticateRequest,
} from "../requests";

/**
 * Maps an incoming HTTP request
 * into an Authentication Context.
 *
 * This mapper isolates the
 * authentication layer from
 * Express, Fastify, Hono,
 * Cloudflare Workers and every
 * other HTTP framework.
 *
 * Browser detection, device
 * detection and network analysis
 * are intentionally NOT performed
 * here. Those responsibilities
 * belong to dedicated Platform
 * services.
 */
export class AuthenticationContextMapper {

  /**
   * Creates an Authentication
   * Context from an HTTP request.
   */
  static fromRequest(
  request: HttpRequest<AuthenticateRequest>,
): AuthenticationContext {

    const body =
      request.body;

    // ========================================================
    // Device
    // ========================================================

    /*
     * The browser already sends a User-Agent on
     * every request, so it is parsed directly
     * instead of relying on x-device-* headers
     * that no browser sets. That is why the
     * security screen previously reported every
     * device, browser and operating system as
     * "Unknown".
     */
    const profile: UserAgentProfile =
      deviceDetector.detect(
        request.headers["user-agent"],
      );

    /*
     * An explicit x-device-* header, when a
     * native client supplies one, still wins
     * over the derived value.
     */
    const device =
      AuthenticationDevice.create({

        deviceId:
          request.headers[
            "x-device-id"
          ] ?? null,

        fingerprint:
          request.headers[
            "x-device-fingerprint"
          ] ?? null,

        name:
          request.headers[
            "x-device-name"
          ] ?? profile.deviceName,

        /**
         * Populated from the User-Agent so the
         * session carries a real category rather
         * than UNKNOWN.
         */
        type:
          toDeviceType(
            profile.deviceType,
          ),

        browser:
          request.headers[
            "x-browser"
          ] ?? profile.browser,

        browserVersion:
          request.headers[
            "x-browser-version"
          ] ?? profile.browserVersion,

        operatingSystem:
          request.headers[
            "x-os"
          ] ?? profile.operatingSystem,

        operatingSystemVersion:
          request.headers[
            "x-os-version"
          ] ?? profile.operatingSystemVersion,

        platform:
          request.headers[
            "x-platform"
          ] ?? profile.platform,

      });

    // ========================================================
    // Network
    // ========================================================

    const network =
      AuthenticationNetwork.create({

        ipAddress:
          request.ipAddress,

        forwardedIpAddress:
          normalizeForwardedIpAddress(
            request.headers[
              "x-forwarded-for"
            ],
          ),

        /*
         * Cloudflare and Vercel both front this
         * service and publish coarse geography on
         * the request. Capturing it here makes the
         * security review meaningful without a
         * paid lookup service.
         */
        country:
          firstHeader(request, [
            "cf-ipcountry",
            "x-vercel-ip-country",
          ]),

        region:
          firstHeader(request, [
            "x-vercel-ip-country-region",
            "cf-region",
          ]),

        city:
          firstHeader(request, [
            "x-vercel-ip-city",
          ]),

        /*
         * Network category is inferred from the
         * mobile hint when a client sends one.
         * Anything else stays UNKNOWN rather than
         * guessing, because a wrong value here
         * would misrepresent a security signal.
         */
        networkType:
          /Mobile/i.test(
            request.headers["user-agent"] ?? "",
          )
            ? NetworkType.CELLULAR
            : NetworkType.UNKNOWN,

      });

    // ========================================================
    // Client
    // ========================================================

    const client =
      AuthenticationClient.create({

        clientId:
          request.headers[
            "x-client-id"
          ] ?? null,

        applicationId:
          request.headers[
            "x-application-id"
          ] ?? null,

        organizationId:
          request.headers[
            "x-organization-id"
          ] ?? null,

        workspaceId:
          request.headers[
            "x-workspace-id"
          ] ?? null,

        tenantId:
          request.headers[
            "x-tenant-id"
          ] ?? null,

      });

    // ========================================================
    // Authentication
    // ========================================================

    const details =
      AuthenticationDetails.create({

        /**
         * Controllers may override
         * these defaults for Passkeys,
         * OAuth, SAML, Magic Links,
         * Passwordless, etc.
         */
        method:
          AuthenticationMethod.PASSWORD,

        level:
          AuthenticationLevel.LOW,

        mfaMethod:
          MfaMethod.NONE,

        rememberMe:
          body.rememberMe ?? false,

      });

    // ========================================================
    // Context
    // ========================================================

    return AuthenticationContext.create({

      device,

      network,

      client,

      details,

    });

  }

}

/**
 * Returns the first non-empty header from a
 * list of candidate names.
 *
 * Geography can arrive from Cloudflare or
 * Vercel depending on which edge served the
 * request, so both are accepted in priority
 * order. A blank or placeholder value ("XX",
 * "T1", "unknown") is treated as absent so the
 * security view never shows a fake location.
 */
function firstHeader(
  request: HttpRequest<AuthenticateRequest>,
  names: readonly string[],
): string | null {
  for (const name of names) {
    const raw = request.headers[name];

    if (typeof raw !== "string") continue;

    const value = raw.trim();

    if (!value) continue;

    if (
      value.toUpperCase() === "XX" ||
      value.toUpperCase() === "T1" ||
      value.toLowerCase() === "unknown"
    ) {
      continue;
    }

    /*
     * Vercel URL-encodes city names.
     */
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return null;
}

/**
 * Narrows a parsed device type string to
 * the DeviceType enum so a value coming
 * from the parser is always valid.
 */
function toDeviceType(value: string): DeviceType {
  const candidates = Object.values(DeviceType) as string[];

  return candidates.includes(value)
    ? (value as DeviceType)
    : DeviceType.UNKNOWN;
}

/**
 * Normalizes the "x-forwarded-for"
 * header into a single valid IP
 * address.
 *
 * Proxies and load balancers (e.g.
 * Vercel, Cloudflare, Render) append
 * their own address to the header,
 * producing a comma-separated chain:
 *
 *   "154.161.53.190,98.83.222.238, ..."
 *
 * PostgreSQL's inet type only
 * accepts one address, so the chain
 * must be reduced to its first
 * (originating client) entry.
 */
export function normalizeForwardedIpAddress(

  value: string | undefined | null,

): string | null {

  if (!value) {

    return null;

  }

  const first = (
    value.split(",")[0] ?? ""
  ).trim();

  if (!first) {

    return null;

  }

  /**
   * Accept IPv4 and IPv6 values only.
   * Anything else (unknown, malformed)
   * would be rejected by the inet type.
   */
  const ipv4 =
    /^(\d{1,3}\.){3}\d{1,3}$/;

  const ipv6 =
    /^[0-9a-fA-F:]+$/;

  if (
    !ipv4.test(first) &&
    !ipv6.test(first)
  ) {

    return null;

  }

  return first;

}