import {
  Account,
  EvantraId,
} from "./account";

import {
  AuthenticationContext,
} from "./authentication";

import {
  BrowserSession,
  Session,
} from "./session";

import {
  RegisterAccountWorkflow,
} from "./workflows/RegisterAccountWorkflow";

import {
  VerifyAccountWorkflow,
} from "./workflows/VerifyAccountWorkflow";

import {
  AuthenticateWorkflow,
} from "./workflows/AuthenticateWorkflow";

/**
 * Public entry point for the
 * Evantra Identity platform.
 *
 * Applications interact with
 * Identity through this facade.
 */
export class Identity {

  constructor(

    private readonly registerAccount:
      RegisterAccountWorkflow,

    private readonly verifyAccount:
      VerifyAccountWorkflow,

    private readonly authenticateAccount:
      AuthenticateWorkflow,

  ) {}

  /**
   * Registers a new account.
   */
  async register(params: {

    evantraId: string;

    contactEmail: string;

    password: string;

  }): Promise<Account> {

    return this.registerAccount.execute(
      params,
    );

  }

  /**
   * Verifies an account.
   */
  async verify(
    token: string,
  ): Promise<void> {

    return this.verifyAccount.execute(
      token,
    );

  }

  /**
   * Authenticates a user.
   */
  async authenticate(params: {

    evantraId: EvantraId;

    password: string;

    context: AuthenticationContext;

  }): Promise<{

    account: Account;

    session: Session;

    browserSession: BrowserSession;

  }> {

    return this.authenticateAccount.execute({

      evantraId:

        params.evantraId,

      password:

        params.password,

      context:

        params.context,

    });

  }

}