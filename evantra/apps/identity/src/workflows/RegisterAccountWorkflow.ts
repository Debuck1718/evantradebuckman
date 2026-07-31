import { Account } from "../account";
import { AccountService } from "../account";

import {
  CredentialService,
} from "../authentication";

import {
  VerificationService,
} from "../verification";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  TokenGenerator,
} from "../platform/TokenGenerator";

import {
  Clock,
} from "../platform/Clock";

/**
 * Coordinates the registration
 * of a new Evantra Account.
 */
export class RegisterAccountWorkflow {

  constructor(
    private readonly accounts: AccountService,
    private readonly credentials: CredentialService,
    private readonly verifications: VerificationService,
    private readonly ids: IdGenerator,
    private readonly tokens: TokenGenerator,
    private readonly clock: Clock
  ) {}

  /**
   * Registers a new account.
   */
  async execute(params: {
    evantraId: string;
    contactEmail: string;
    password: string;
  }): Promise<Account> {

    // Platform-generated values
    const accountId =
      this.ids.account();

    const verificationId =
      this.ids.verification();

    const token =
      this.tokens.verification();

    const expiresAt =
      this.clock.afterMinutes(30);

    // Register account
    const account =
      await this.accounts.register({
        id: accountId,
        evantraId: params.evantraId,
        contactEmail: params.contactEmail,
      });

    // Create credential
    await this.credentials.create({
      accountId,
      password: params.password,
    });

    // Create verification
    await this.verifications.create({
      id: verificationId,
      accountId,
      token,
      expiresAt,
    });

    return account;
  }
}