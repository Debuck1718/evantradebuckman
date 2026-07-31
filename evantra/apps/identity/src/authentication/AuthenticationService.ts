import {
  Account,
  AccountRepository,
  EvantraId,
} from "../account";

import {
  CredentialService,
} from "./CredentialService";

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
    private readonly accounts: AccountRepository,
    private readonly credentialService: CredentialService
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
        params.evantraId
      );

    if (!account) {
      throw new Error(
        "Invalid credentials."
      );
    }

    if (!account.isActive()) {
      throw new Error(
        "Account is not active."
      );
    }

    const valid =
      await this.credentialService.verify(
        account.id,
        params.password
      );

    if (!valid) {
      throw new Error(
        "Invalid credentials."
      );
    }

    return account;
  }
}