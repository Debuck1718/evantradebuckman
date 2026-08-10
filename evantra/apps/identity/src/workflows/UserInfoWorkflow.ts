import { AccountService } from "../account/AccountService";
import { TokenService } from "../authorization/TokenService";

/**
 * OAuth 2.0 / OpenID Connect-style
 * UserInfo application workflow.
 *
 * Resolves the authenticated account
 * represented by an active OAuth
 * access token.
 */
export class UserInfoWorkflow {

  constructor(

    private readonly tokens:
      TokenService,

    private readonly accounts:
      AccountService,

  ) {}

  /**
   * Resolves the authenticated user
   * represented by the supplied access token.
   */
  async execute(
    accessToken: string,
  ) {

    const token =
      await this.tokens.validateAccessToken(
        accessToken,
      );

    const account =
      await this.accounts.findById(
        token.accountId,
      );

    if (!account) {

      throw new Error(
        "Authenticated account not found.",
      );

    }

    return account;

  }

}