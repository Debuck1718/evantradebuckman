import {
  AccountService,
} from "../account";

import {
  AuthenticationService,
  CredentialService,
} from "../authentication";

import {
  CommunicationService,
} from "../communication";

import {
  ValidateBrowserSessionWorkflow,
} from "./ValidateBrowserSessionWorkflow";

import {
  RevokeAllBrowserSessionsWorkflow,
} from "./RevokeAllBrowserSessionsWorkflow";

import {

  AuditAction,

  AuditSeverity,

  AuditService,

} from "../audit";

/**
 * Changes an authenticated
 * user's password.
 */
export class ChangePasswordWorkflow {

  constructor(

    private readonly validateSession:
      ValidateBrowserSessionWorkflow,

    private readonly accounts:
      AccountService,

    private readonly authentication:
      AuthenticationService,

    private readonly credentials:
      CredentialService,

    private readonly revokeAll:
      RevokeAllBrowserSessionsWorkflow,

    private readonly communication:
      CommunicationService,

    private readonly audit:
  AuditService,  

  ) {}

  /**
   * Changes the account password.
   */
  async execute(params: {

    sessionId: string;

    currentPassword: string;

    newPassword: string;

  }): Promise<void> {

    // ======================================================
    // Validate Browser Session
    // ======================================================

    const session =
      await this.validateSession.execute({

        sessionId:

          params.sessionId,

      });

    // ======================================================
    // Load Account
    // ======================================================

    const account =
      await this.accounts.findById(

        session.identity.accountId,

      );

    if (!account) {

      throw new Error(
        "Account not found.",
      );

    }

    // ======================================================
    // Verify Current Password
    // ======================================================

    await this.authentication.verifyPassword({

      accountId:

        account.id,

      password:

        params.currentPassword,

    });

    // ======================================================
    // Change Password
    // ======================================================

    await this.credentials.changePassword(

      account.id,

      params.newPassword,

    );

    // ======================================================
    // Revoke Every Other Session
    // ======================================================

    await this.revokeAll.execute({

      evantraId:

        account.evantraId,

      exceptSessionId:

        session.identity.sessionId,

    });

    await this.audit.record({

  accountId:

    account.id,

  action:

    AuditAction.PASSWORD_CHANGED,

  severity:

    AuditSeverity.SECURITY,

});

    // ======================================================
    // Notify User
    // ======================================================

    await this.communication
      .sendPasswordChanged({

        contactEmail:

          account
            .contactEmail
            .value(),

        evantraId:

          account
            .evantraId
            .value(),

      });

  }

}