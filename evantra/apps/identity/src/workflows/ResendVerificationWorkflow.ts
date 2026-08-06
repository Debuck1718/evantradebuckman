import {
    Account,
  AccountService,
} from "../account";

import {
  VerificationService,
} from "../verification";

import {
  CommunicationService,
} from "../communication";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  TokenGenerator,
} from "../platform/TokenGenerator";

import {
  Clock,
} from "../platform/Clock";

/**
 * Sends a new account
 * verification request.
 */
export class ResendVerificationWorkflow {

  constructor(

    private readonly accounts:
      AccountService,

    private readonly verifications:
      VerificationService,

    private readonly communication:
      CommunicationService,

    private readonly ids:
      IdGenerator,

    private readonly tokens:
      TokenGenerator,

    private readonly clock:
      Clock,

  ) {}

  async execute(params: {

    contactEmail: string;

  }): Promise<void> {

    // ======================================================
    // Find Account
    // ======================================================

    const account =
      await this.accounts.findByContactEmail(

        params.contactEmail,

      );

    // Prevent account enumeration.
    if (!account) {

      return;

    }

    // ======================================================
    // Already Verified
    // ======================================================

    const isVerified =
      (account as Account & { isVerified?: boolean }).isVerified ?? false;

    if (isVerified) {

      return;

    }

    // ======================================================
    // Remove Existing Verification
    // ======================================================

    const existing =
      await this.verifications.findByAccountId(

        account.id,

      );

    if (existing) {

      await this.verifications.delete(

        existing.id,

      );

    }

    // ======================================================
    // Create New Verification
    // ======================================================

    const verification =
      await this.verifications.create({

        id:

          this.ids.verification(),

        accountId:

          account.id,

        token:

          this.tokens.verification(),

        expiresAt:

          this.clock.afterMinutes(30),

      });

    // ======================================================
    // Notify User
    // ======================================================

    await this.communication
      .sendAccountVerification({

        contactEmail:

          account
          .contactEmail
          .value(),

        evantraId:

          account
            .evantraId
            .value(),

        token:

          verification.token,

        expiresAt:

          verification.expiresAt,

      });

  }

}