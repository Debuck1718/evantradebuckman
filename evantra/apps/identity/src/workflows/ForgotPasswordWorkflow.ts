import {
  AccountService,
} from "../account";

import {
  RecoveryService,
} from "../recovery";

import {
  CommunicationService,
} from "../communication";

/**
 * Coordinates password
 * recovery requests.
 *
 * Recovery is initiated using
 * the account's contact email.
 *
 * The workflow intentionally
 * returns successfully even if
 * the account does not exist
 * to prevent account enumeration.
 */
export class ForgotPasswordWorkflow {

  constructor(

    private readonly accounts:
      AccountService,

    private readonly recoveries:
      RecoveryService,

    private readonly communication:
      CommunicationService,

  ) {}

  /**
   * Starts password recovery.
   */
  async execute(params: {

    contactEmail: string;

  }): Promise<void> {

    // ======================================================
    // Locate Account
    // ======================================================

    const account =
      await this.accounts.findByContactEmail(

        params.contactEmail,

      );

    // ======================================================
    // Unknown Contact Email
    // ======================================================

    if (!account) {

      return;

    }

    // ======================================================
    // Create Recovery Request
    // ======================================================

    const recovery =
      await this.recoveries.create(

        account.id,

      );

    // ======================================================
    // Send Recovery Email
    // ======================================================

    await this.communication
      .sendPasswordRecovery({

        contactEmail:

          account.contactEmail.value(),

        evantraId:

          account
            .evantraId
            .value(),

        token:

          recovery.token,

        expiresAt:

          recovery.expiresAt,

      });

  }

}