import {
  Account,
  AccountService,
} from "../account";

import {
  BrowserSession,
} from "../session";

import {
  SessionNotFoundError,
} from "../session/errors";

import {
  ValidateBrowserSessionWorkflow,
} from "./ValidateBrowserSessionWorkflow";

export class ValidateIdentitySessionWorkflow {

  constructor(
    private readonly validateSession:
      ValidateBrowserSessionWorkflow,
    private readonly accounts:
      AccountService,
  ) {}

  async execute(params: {
    sessionId: string;
  }): Promise<{
    account: Account;
    session: BrowserSession;
  }> {
    const session =
      await this.validateSession.execute({
        sessionId: params.sessionId,
      });

    const account =
      await this.accounts.findById(
        session.identity.accountId,
      );

    if (!account) {
      throw new SessionNotFoundError();
    }

    return {
      account,
      session,
    };
  }

}
