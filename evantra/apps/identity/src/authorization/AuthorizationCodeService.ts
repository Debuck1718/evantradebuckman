import { AuthorizationCode } from "./AuthorizationCode";
import { AuthorizationCodeRepository } from "./AuthorizationCodeRepository";

import { AuthorizationCodeGenerator } from "../platform/AuthorizationCodeGenerator";
import { IdGenerator } from "../platform/IdGenerator";
import { Clock } from "../platform/Clock";
import { SecurityConfiguration } from "../platform/SecurityConfiguration";

import { RedirectUri } from "../client";
import { PkceMethod } from "./PkceMethod";

import {
  InvalidGrantError,
} from "../oauth/errors";

/**
 * Coordinates OAuth
 * Authorization Code
 * operations.
 *
 * RFC6749
 * RFC7636
 */
export class AuthorizationCodeService {

  constructor(

    private readonly repository: AuthorizationCodeRepository,

    private readonly ids: IdGenerator,

    private readonly generator: AuthorizationCodeGenerator,

    private readonly clock: Clock,

    private readonly security: SecurityConfiguration,

  ) {}

  /**
   * Issues a new
   * Authorization Code.
   */
  async issue(params: {

    clientId: string;

    accountId: string;

    redirectUri: RedirectUri;

    codeChallenge: string;

    codeChallengeMethod: PkceMethod;

    /**
     * OpenID Connect nonce.
     */
    nonce?: string | null;

    /**
     * Granted scopes.
     */
    scopes: readonly string[];

  }): Promise<AuthorizationCode> {

    const now =
      this.clock.now();

    const expiresAt =
      new Date(

        now.getTime() +
        this.security.authorizationCodeLifetime,

      );

    const authorizationCode =
      AuthorizationCode.create({

        id:
          this.ids.authorizationCode(),

        clientId:
          params.clientId,

        accountId:
          params.accountId,

        redirectUri:
          params.redirectUri,

        code:
          await this.generator.generate(),

        codeChallenge:
          params.codeChallenge,

        codeChallengeMethod:
          params.codeChallengeMethod,

        nonce:
          params.nonce ?? null,

        scopes:
          [...params.scopes],

        expiresAt,

      });

    await this.repository.create(
      authorizationCode,
    );

    return authorizationCode;

  }

  /**
   * Finds an Authorization Code.
   */
  async findByCode(
    code: string,
  ): Promise<AuthorizationCode | null> {

    return this.repository.findByCode(
      code,
    );

  }

  /**
   * Finds an active
   * Authorization Code.
   */
  async findActive(
    code: string,
  ): Promise<AuthorizationCode> {

    const authorizationCode =
      await this.repository.findActiveByCode(
        code,
      );

    if (!authorizationCode) {

      throw new InvalidGrantError(
        "Invalid authorization code.",
      );

    }

    if (!authorizationCode.isActive()) {

      throw new InvalidGrantError(
        "Authorization code is no longer active.",
      );

    }

    return authorizationCode;

  }

  /**
   * Consumes an
   * Authorization Code.
   */
  async consume(
    authorizationCode: AuthorizationCode,
  ): Promise<void> {

    authorizationCode.consume();

    await this.repository.update(
      authorizationCode,
    );

  }

  /**
   * Deletes an
   * Authorization Code.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.repository.delete(
      id,
    );

  }

}