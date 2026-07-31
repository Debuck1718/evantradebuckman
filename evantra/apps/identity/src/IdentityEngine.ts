import {
  RegisterAccountWorkflow,
  VerifyAccountWorkflow,
  AuthenticateWorkflow,
  RegisterClientWorkflow,
} from "./workflows";

import {
  AccountService,
} from "./account";

import {
  CredentialService,
} from "./authentication";

import {
  VerificationService,
} from "./verification";

import {
  RecoveryService,
} from "./recovery";

import {
  SessionService,
} from "./session";

import {
  AccountRepository,
} from "./account";

import {
  CredentialRepository,
} from "./authentication";

import {
  VerificationRepository,
} from "./verification";

import {
  RecoveryRepository,
} from "./recovery";

import {
  SessionRepository,
} from "./session";

import {
  AuthenticationService,
} from "./authentication";

import {
  ClientService,
} from "./client";

import {
  ClientRepository,
} from "./client";

import {
  RegisterClientRedirectUriWorkflow,
} from "./workflows";

import {
  ClientRedirectUriService,
} from "./client";

import {
  ClientRedirectUriRepository,
} from "./client";
/**
 * Represents a fully configured
 * Evantra Identity engine.
 *
 * This is the application's
 * composition root.
 */
export class IdentityEngine {

  constructor(

    /**
     * Identity workflows.
     */
    public readonly workflows: {

      registerAccount: RegisterAccountWorkflow;

      verifyAccount: VerifyAccountWorkflow;

      authenticate: AuthenticateWorkflow;

      registerClient: RegisterClientWorkflow;

      registerClientRedirectUri: RegisterClientRedirectUriWorkflow;

    },

    /**
     * Domain services.
     */
    public readonly services: {

      accounts: AccountService;

      authentication: AuthenticationService;

      credentials: CredentialService;

      verifications: VerificationService;

      recoveries: RecoveryService;

      sessions: SessionService;

      clients: ClientService;

      redirectUris: ClientRedirectUriService,


    },

    /**
     * Persistence layer.
     */
    public readonly repositories: {

      accounts: AccountRepository;

      credentials: CredentialRepository;

      verifications: VerificationRepository;

      recoveries: RecoveryRepository;

      sessions: SessionRepository;

      clients: ClientRepository;

      redirectUris: ClientRedirectUriRepository;

    }

  ) {}

}