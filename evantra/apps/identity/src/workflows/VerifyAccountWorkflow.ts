import {
  AccountService,
} from "../account";

import {
  VerificationService,
} from "../verification";

/**
 * Coordinates the verification
 * of an Evantra Account.
 *
 * This workflow confirms a
 * verification request and
 * activates the associated account.
 */
export class VerifyAccountWorkflow {

  constructor(
    private readonly accounts: AccountService,
    private readonly verifications: VerificationService
  ) {}

  /**
   * Executes the account
   * verification workflow.
   */
  async execute(
    token: string
  ): Promise<void> {

    // Find verification request.
    const verification =
      await this.verifications.findByToken(
        token
      );

    if (!verification) {
      throw new Error(
        "Verification request not found."
      );
    }

    // Complete verification.
    await this.verifications.verify(
      verification
    );

    // Find account.
    const account =
      await this.accounts.findById(
        verification.accountId
      );

    if (!account) {
      throw new Error(
        "Account not found."
      );
    }

    // Activate account.
    await this.accounts.activate(
      account
    );
  }
}