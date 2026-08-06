import {
  AccountService,
} from "../account";

import {
  EmailChangeService,
} from "../emailChange";

import {
  CommunicationService,
} from "../communication";

import {

  AuditAction,

  AuditSeverity,

  AuditService,

} from "../audit";
/**
 * Completes a pending
 * contact email change.
 */
export class VerifyContactEmailChangeWorkflow {

  constructor(

  private readonly accounts:
    AccountService,

  private readonly emailChanges:
    EmailChangeService,

  private readonly communication:
    CommunicationService,

  private readonly audit:
  AuditService,  

) {}

  /**
   * Verifies the request.
   */
  async execute(params: {

    token: string;

  }): Promise<void> {

    // ======================================================
    // Find Request
    // ======================================================

    const request =
      await this.emailChanges.findByToken(

        params.token,

      );

    if (!request) {

      throw new Error(
        "Email change request not found.",
      );

    }

    // ======================================================
    // Verify Request
    // ======================================================

    await this.emailChanges.verify(

      request,

    );

    // ======================================================
    // Load Account
    // ======================================================

    const account =
      await this.accounts.findById(

        request.accountId,

      );

    if (!account) {

      throw new Error(
        "Account not found.",
      );

    }

    // ======================================================
    // Update Contact Email
    // ======================================================

    await this.accounts.changeContactEmail(

      account,

      request.newContactEmail,

    );

    await this.audit.record({

  accountId:

    account.id,

  action:

    AuditAction.CONTACT_EMAIL_CHANGED,

  severity:

    AuditSeverity.SECURITY,

});

    // ======================================================
    // Cleanup
    // ======================================================

    await this.emailChanges.delete(

      request.id,

    );

    await this.communication
  .sendContactEmailChanged({

    contactEmail:

      request.newContactEmail,

    evantraId:

      account.evantraId.value(),

  });

  }

}