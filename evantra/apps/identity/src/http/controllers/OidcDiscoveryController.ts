import {
  NextFunction,
  Request,
  Response,
} from "express";

/**
 * OpenID Connect discovery endpoint.
 */
export class OidcDiscoveryController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issuer =
        this.resolveIssuer(
          request,
        );

      response.status(200).json({
        issuer,
        authorization_endpoint:
          `${issuer}/oauth/authorize`,
        token_endpoint:
          `${issuer}/oauth/token`,
        userinfo_endpoint:
          `${issuer}/oauth/userinfo`,
        revocation_endpoint:
          `${issuer}/oauth/revoke`,
        introspection_endpoint:
          `${issuer}/oauth/introspect`,
        jwks_uri:
          `${issuer}/.well-known/jwks.json`,
        response_types_supported: [
          "code",
        ],
        grant_types_supported: [
          "authorization_code",
          "refresh_token",
        ],
        subject_types_supported: [
          "public",
        ],
        token_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
        ],
        introspection_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
        ],
        code_challenge_methods_supported: [
          "S256",
        ],
        scopes_supported: [
          "openid",
          "profile",
          "email",
        ],
        claims_supported: [
          "sub",
          "name",
          "given_name",
          "family_name",
          "email",
        ],
        id_token_signing_alg_values_supported: [
          "none",
        ],
      });
    } catch (error) {
      next(error);
    }
  }

  private resolveIssuer(
    request: Request,
  ): string {
    const host =
      request.headers.host ||
      "localhost:3000";

    const forwarded =
      request.headers[
        "x-forwarded-proto"
      ] as string | undefined;

    const forwardedScheme =
      forwarded
        ?.split(",")
        .map((value) => value.trim())
        .find(Boolean);

    const protocol =
      forwardedScheme ||
      request.protocol ||
      "http";

    return `${protocol}://${host}`;
  }
}
