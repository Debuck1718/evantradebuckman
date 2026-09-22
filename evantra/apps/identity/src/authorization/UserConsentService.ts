import {
  UserConsent,
} from "./UserConsent";

import {
  UserConsentRepository,
} from "./UserConsentRepository";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  Clock,
} from "../platform/Clock";

/**
 * Coordinates user consent for
 * OAuth clients.
 *
 * Consent is recorded per scope so a client
 * only ever holds the scopes the resource
 * owner explicitly approved.
 */
export class UserConsentService {

  constructor(

    private readonly repository:
      UserConsentRepository,

    private readonly ids:
      IdGenerator,

    private readonly clock:
      Clock,

  ) { }

  /**
   * Records consent for a set of scopes.
   *
   * Scopes already granted stay untouched, so
   * the original granted_at is preserved for
   * audit purposes. Revoked scopes are
   * reinstated. Missing scopes are inserted.
   */
  async grant(params: {

    accountId: string;

    clientId: string;

    scopes: readonly string[];

  }): Promise<void> {

    const existing =
      await this.repository
        .findByAccountAndClient(
          params.accountId,
          params.clientId,
        );

    const byScope =
      new Map(
        existing.map(
          (consent) => [
            consent.scope,
            consent,
          ],
        ),
      );

    for (const scope of params.scopes) {

      const current =
        byScope.get(scope);

      if (!current) {

        await this.repository.create(
          UserConsent.grant({

            id:
              this.ids.userConsent(),

            accountId:
              params.accountId,

            clientId:
              params.clientId,

            scope,

            grantedAt:
              this.clock.now(),

          }),
        );

        continue;

      }

      /*
       * The unique index is on
       * (account_id, client_id, scope), so a
       * revoked row cannot be inserted again.
       * It is reinstated instead.
       */
      if (!current.isActive()) {

        current.reinstate();

        await this.repository.update(
          current,
        );

      }

    }

  }

  /**
   * Returns every active scope an account
   * has granted to a client.
   */
  async grantedScopes(params: {

    accountId: string;

    clientId: string;

  }): Promise<string[]> {

    const consents =
      await this.repository
        .findByAccountAndClient(
          params.accountId,
          params.clientId,
        );

    return consents
      .filter((consent) => consent.isActive())
      .map((consent) => consent.scope);

  }

  /**
   * Returns true when the account has
   * already granted every requested scope.
   *
   * Used to decide whether the consent
   * screen can be skipped.
   */
  async hasGranted(params: {

    accountId: string;

    clientId: string;

    scopes: readonly string[];

  }): Promise<boolean> {

    const granted =
      new Set(
        await this.grantedScopes({
          accountId: params.accountId,
          clientId: params.clientId,
        }),
      );

    return params.scopes.every(
      (scope) => granted.has(scope),
    );

  }

  /**
   * Lists every consent an account
   * has recorded, for the security
   * and privacy screens.
   */
  async listForAccount(
    accountId: string,
  ): Promise<UserConsent[]> {

    return this.repository
      .findByAccountId(accountId);

  }

  /**
   * Revokes consent for a set of scopes.
   *
   * Passing an empty list revokes every
   * scope the account granted to the client.
   */
  async revoke(params: {

    accountId: string;

    clientId: string;

    scopes?: readonly string[];

  }): Promise<void> {

    const consents =
      await this.repository
        .findByAccountAndClient(
          params.accountId,
          params.clientId,
        );

    const targets =
      params.scopes && params.scopes.length > 0
        ? new Set(params.scopes)
        : null;

    const revokedAt =
      this.clock.now();

    for (const consent of consents) {

      if (!consent.isActive()) {

        continue;

      }

      if (targets && !targets.has(consent.scope)) {

        continue;

      }

      consent.revoke(revokedAt);

      await this.repository.update(
        consent,
      );

    }

  }

  /**
   * Revokes every consent held by a
   * client, used when a client is
   * disabled or revoked by an administrator.
   */
  async revokeAllForClient(
    clientId: string,
  ): Promise<void> {

    const consents =
      await this.repository
        .findByClientId(clientId);

    const revokedAt =
      this.clock.now();

    for (const consent of consents) {

      if (!consent.isActive()) {

        continue;

      }

      consent.revoke(revokedAt);

      await this.repository.update(
        consent,
      );

    }

  }

}