import { Account, EvantraId } from "../account";

import {
  AuthenticationService,
} from "../authentication";

import {
  Session,
  SessionService,
} from "../session";

/**
 * Coordinates user authentication.
 *
 * This workflow authenticates an
 * Evantra Account and starts a
 * new authenticated session.
 */
export class AuthenticateWorkflow {

  constructor(
    private readonly authentication: AuthenticationService,
    private readonly sessions: SessionService
  ) {}

  /**
   * Authenticates a user and
   * starts a new session.
   */
  async execute(params: {
    evantraId: EvantraId;
    password: string;
  }): Promise<{
    account: Account;
    session: Session;
  }> {

    const account =
      await this.authentication.authenticate({
        evantraId: params.evantraId,
        password: params.password,
      });

    const session =
      await this.sessions.start(
        account.id
      );

    return {
      account,
      session,
    };
  }
}