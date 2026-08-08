import {
  AuthorizationCodeGrantSchema,
} from "./AuthorizationCodeGrantSchema";

import {
  RefreshTokenGrantSchema,
} from "./RefreshTokenGrantSchema";

import {
  InvalidRequestError,
} from "../../../oauth/errors";

import {
  TokenRequest,
} from "../TokenRequest";

export function validateTokenRequest(
  request: TokenRequest
): TokenRequest {

  if (!request.grant_type) {
    throw new InvalidRequestError(
      "grant_type is required."
    );
  }

  switch (request.grant_type) {

    case "authorization_code": {

      const result =
        AuthorizationCodeGrantSchema.safeParse(
          request
        );

      if (!result.success) {
        throw new InvalidRequestError(
          result.error.issues[0]?.message ??
          "Invalid authorization code request."
        );
      }

      return result.data as TokenRequest;
    }

    case "refresh_token": {

      const result =
        RefreshTokenGrantSchema.safeParse(
          request
        );

      if (!result.success) {
        throw new InvalidRequestError(
          result.error.issues[0]?.message ??
          "Invalid refresh token request."
        );
      }

      return result.data as TokenRequest;
    }

    default:

      throw new InvalidRequestError(
        "Invalid OAuth token request."
      );
  }
}