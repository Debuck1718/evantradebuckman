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
          ] ?? null,

        /**
         * Will eventually be supplied
         * by the Device Detection
         * Platform Service.
         */
        type:
          DeviceType.UNKNOWN,

        browser:
          request.headers[
            "x-browser"
          ] ?? null,

        browserVersion:
          request.headers[
            "x-browser-version"
          ] ?? null,

        operatingSystem:
          request.headers[
            "x-os"
          ] ?? null,

        operatingSystemVersion:
          request.headers[
            "x-os-version"
          ] ?? null,

        platform:
          request.headers[
            "x-platform"
          ] ?? null,

      });

    // ========================================================
    // Network
    // ========================================================

    const network =
      AuthenticationNetwork.create({

        ipAddress:
          request.ipAddress,

        forwardedIpAddress:
          request.headers[
            "x-forwarded-for"
          ] ?? null,

        /**
         * Future:
         * Network Detection Service.
         */
        networkType:
          NetworkType.UNKNOWN,

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