import {
  AccountService,
} from "../account";

import {
  AuthenticationService,
} from "../authentication";

import {
  EmailChangeService,
} from "../emailChange";

import {
  CommunicationService,
} from "../communication";
import { ValidateBrowserSessionWorkflow } from "./ValidateBrowserSessionWorkflow";

/**
 * Requests a contact email
 * change for an account.
 */
export class RequestContactEmailChangeWorkflow {

  constructor(

    private readonly validateSession:
        ValidateBrowserSessionWorkflow,

    private readonly accounts:
        AccountService,

    private readonly authentication:
        AuthenticationService,

    private readonly emailChanges:
        EmailChangeService,

    private readonly communication:
        CommunicationService,

) {}

  /**
   * Requests a contact email change.
   */
  async execute(params: {

    sessionId: string;

    currentPassword: string;

    newContactEmail: string;

  }): Promise<void> {

      // ======================================================
// Validate Session
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

    await this.authentication.authenticate({

      evantraId:

        account.evantraId,

      password:

        params.currentPassword,

    });

    // ======================================================
    // Ensure Contact Email Is Available
    // ======================================================

    const existing =
      await this.accounts.findByContactEmail(

        params.newContactEmail,

      );

    if (existing) {

      throw new Error(
        "Contact email already exists.",
      );

    }

    // ======================================================
    // Remove Existing Pending Request
    // ======================================================

    const pending =
      await this.emailChanges.findByAccountId(

        account.id,

      );

    if (pending) {

      await this.emailChanges.delete(

        pending.id,

      );

    }

    // ======================================================
    // Create New Request
    // ======================================================

    const request =
      await this.emailChanges.create({

        accountId:

          account.id,

        newContactEmail:

          params.newContactEmail,

      });

    // ======================================================
    // Send Verification
    // ======================================================

    await this.communication
      .sendContactEmailVerification({

        contactEmail:

          params.newContactEmail,

        evantraId:

          account.evantraId.value(),

        token:

          request.token,

        expiresAt:

          request.expiresAt,

      });

  }

}