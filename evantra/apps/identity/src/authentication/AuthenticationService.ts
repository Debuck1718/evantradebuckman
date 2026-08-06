import {
  Account,
  AccountRepository,
  EvantraId,
} from "../account";

import {
  CredentialService,
} from "./CredentialService";

import {
  InvalidCredentialsError,
  InactiveAccountError,
  AccountLockedError,
} from "./errors";

import {
  LoginAttempt,
  LoginAttemptService,
} from "../loginAttempt";

import {
  Clock,
} from "../platform/Clock";

import {
  SecurityConfiguration,
} from "../platform/SecurityConfiguration";

/**
 * Coordinates account authentication.
 *
 * Responsible for verifying an
 * Evantra ID and password.
 *
 * This service does not create
 * sessions or issue tokens.
 */
export class AuthenticationService {

  constructor(

    private readonly accounts:
      AccountRepository,

    private readonly credentialService:
      CredentialService,

    private readonly loginAttempts:
      LoginAttemptService,

    private readonly security:
      SecurityConfiguration,

    private readonly clock:
      Clock,

  ) {}

  /**
   * Authenticates an account.
   */
  async authenticate(params: {

    evantraId: EvantraId;

    password: string;

  }): Promise<Account> {

    const account =
      await this.accounts.findByEvantraId(

        params.evantraId,

      );

    if (!account) {

      throw new InvalidCredentialsError();

    }

    if (!account.isActive()) {

      throw new InactiveAccountError();

    }

    // ======================================================
    // Login Attempts
    // ======================================================

    let attempt =
      await this.loginAttempts.findByEvantraId(

        params.evantraId.value(),

      );

    if (

      attempt?.isLocked()

    ) {

      throw new AccountLockedError();

    }

    // ======================================================
    // Verify Password
    // ======================================================

    const valid =
      await this.credentialService.verify(

        account.id,

        params.password,

      );

    if (!valid) {

      if (!attempt) {

        attempt =
          LoginAttempt.create(

            params.evantraId.value(),

          );

      }

      attempt.increment();

      if (

        attempt.getAttempts() >=
        this.security.maxFailedLoginAttempts

      ) {

        const lockedUntil =
          this.clock.afterMinutes(

            this.security.accountLockDuration / 60000,

          );

        attempt.lock(

          lockedUntil,

        );

      }

      await this.loginAttempts.save(

        attempt,

      );

      throw new InvalidCredentialsError();

    }

    // ======================================================
    // Successful Login
    // ======================================================

    if (attempt) {

      attempt.reset();

      await this.loginAttempts.save(

        attempt,

      );

    }

    return account;

  }

  /**
   * Verifies an account password.
   *
   * Used by authenticated
   * operations such as changing
   * a password.
   */
  async verifyPassword(params: {

    accountId: string;

    password: string;

  }): Promise<void> {

    const valid =
      await this.credentialService.verify(

        params.accountId,

        params.password,

      );

    if (!valid) {

      throw new InvalidCredentialsError();

    }

  }

}