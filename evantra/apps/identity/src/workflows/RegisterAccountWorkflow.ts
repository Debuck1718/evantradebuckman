import {
  Account,
  AccountService,
} from "../account";

import {
  CredentialService,
} from "../authentication";

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

import {
  AuditAction,
  AuditSeverity,
  AuditService,
} from "../audit";

/**
 * Coordinates the registration
 * of a new Evantra Account.
 */
export class RegisterAccountWorkflow {

  constructor(

    private readonly accounts:
      AccountService,

    private readonly credentials:
      CredentialService,

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

    private readonly audit:
      AuditService,

  ) {}

 /**
 * Registers a new
 * Evantra Account.
 */
async execute(params: {
  firstName: string;
  lastName: string;
  evantraId: string;
  contactEmail: string;
  password: string;
}): Promise<Account> {

  // ======================================================
  // Platform-generated values
  // ======================================================

  const accountId =
    this.ids.account();

  const verificationId =
    this.ids.verification();

  const token =
    this.tokens.verification();

  const expiresAt =
    this.clock.afterMinutes(
      30,
    );

  // ======================================================
  // Register Account
  // ======================================================

  const account =
    await this.accounts.register({

      id:
        accountId,

      firstName:
        params.firstName,

      lastName:
        params.lastName,

      evantraId:
        params.evantraId,

      contactEmail:
        params.contactEmail,

    });

  // ======================================================
  // Create Credential
  // ======================================================

  await this.credentials.create({

    accountId,

    password:
      params.password,

  });

  // ======================================================
  // Create Verification
  // ======================================================

  const verification =
    await this.verifications.create({

      id:
        verificationId,

      accountId,

      token,

      expiresAt,

    });

  // ======================================================
  // Send Verification Email
  // ======================================================

  await this.communication
    .sendAccountVerification({

      contactEmail:
        account.contactEmail.value(),

      evantraId:
        account.evantraId.value(),

      token:
        verification.token,

      expiresAt:
        verification.expiresAt,

    });

  // ======================================================
  // Audit
  // ======================================================

  await this.audit.record({

    accountId:
      account.id,

    action:
      AuditAction.ACCOUNT_REGISTERED,

    severity:
      AuditSeverity.INFO,

  });

  // ======================================================
  // Result
  // ======================================================

  return account;
}
}