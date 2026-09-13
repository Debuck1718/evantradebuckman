import {
  Account,
  AccountService,
} from "../account";

import {
  AuditAction,
  AuditSeverity,
  AuditService,
} from "../audit";

/**
 * Reactivates an account after
 * administrative review.
 */
export class ReactivateAccountWorkflow {

  constructor(
    private readonly accounts: AccountService,
    private readonly audit: AuditService,
  ) {}

  async execute(params: {
    accountId: string;
    reason: string;
  }): Promise<Account> {
    const account =
      await this.accounts.findById(
        params.accountId,
      );

    if (!account) {
      throw new Error(
        "Account not found.",
      );
    }

    const previousStatus =
      account.getStatus();

    await this.accounts.reactivate(account);

    await this.audit.record({
      accountId: account.id,
      action: AuditAction.ACCOUNT_REACTIVATED,
      severity: AuditSeverity.SECURITY,
      metadata: {
        reason: params.reason,
        previousStatus,
        newStatus: account.getStatus(),
      },
    });

    return account;
  }
}