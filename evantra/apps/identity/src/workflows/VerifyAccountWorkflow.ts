import {
  AccountService,
} from "../account";

import {
  AccountStatus,
} from "../account/AccountStatus";

import {
  VerificationService,
} from "../verification";

import {

  AuditAction,

  AuditSeverity,

  AuditService,

} from "../audit";
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
    private readonly audit:
  AuditService,
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

    // Email verification may only complete onboarding.
    if (
      account.getStatus() !==
      AccountStatus.PENDING_VERIFICATION
    ) {
      throw new Error(
        "Account cannot be verified in its current state."
      );
    }

    // Consume the token only after the account state is valid.
    await this.verifications.verify(
      verification
    );

    // Activate account.
    await this.accounts.activate(
      account
    );

    await this.audit.record({

  accountId:

    account.id,

  action:

    AuditAction.ACCOUNT_VERIFIED,

  severity:

    AuditSeverity.INFO,

});
  }
}