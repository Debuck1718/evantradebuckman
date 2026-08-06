import {
  CredentialService,
} from "../authentication";

import {
  RecoveryService,
} from "../recovery";

import {
  CommunicationService,
} from "../communication";

import {
  AccountService,
} from "../account";

import {
  RevokeAllBrowserSessionsWorkflow,
} from "./RevokeAllBrowserSessionsWorkflow";

import {

  AuditAction,

  AuditSeverity,

  AuditService,

} from "../audit";

/**
 * Completes a password
 * recovery request.
 */
export class ResetPasswordWorkflow {

  constructor(

    private readonly recoveries:
      RecoveryService,

    private readonly credentials:
      CredentialService,

    private readonly accounts:
      AccountService,

    private readonly revokeAll:
      RevokeAllBrowserSessionsWorkflow,

    private readonly communication:
      CommunicationService,

     private readonly audit:
  AuditService, 

  ) {}

  /**
   * Resets an account password.
   */
  async execute(params: {

    token: string;

    password: string;

  }): Promise<void> {

    // ======================================================
    // Find Recovery Request
    // ======================================================

    const recovery =
      await this.recoveries.findByToken(

        params.token,

      );

    if (!recovery) {

      throw new Error(
        "Recovery request not found.",
      );

    }

    

    // ======================================================
    // Update Password
    // ======================================================

    await this.credentials.changePassword(

      recovery.accountId,

      params.password,

    );

    // ======================================================
    // Persist Recovery State
    // ======================================================

    await this.recoveries.use(

      recovery,

    );

    // ======================================================
    // Load Account
    // ======================================================

    const account =
      await this.accounts.findById(

        recovery.accountId,

      );

    if (!account) {

      return;

    }

    // ======================================================
    // Revoke Every Browser Session
    // ======================================================

    await this.revokeAll.execute({

      evantraId:

        account.evantraId,

    });

    await this.audit.record({

  accountId:

    account.id,

  action:

    AuditAction.PASSWORD_RESET,

  severity:

    AuditSeverity.SECURITY,

});

    // ======================================================
    // Notify User
    // ======================================================

    await this.communication
      .sendPasswordChanged({

        contactEmail:

          account.contactEmail.value(),

        evantraId:

          account
            .evantraId
            .value(),

      });

  }

}