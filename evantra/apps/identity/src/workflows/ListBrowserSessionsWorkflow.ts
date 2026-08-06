import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

/**
 * Returns every Browser
 * Session belonging to
 * an Account.
 */
export class ListBrowserSessionsWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Returns every Browser
   * Session belonging to
   * the specified Account.
   */
  async execute(params: {

    accountId: string;

  }): Promise<BrowserSession[]> {

    return this.sessions.findByAccountId(

      params.accountId,

    );

  }

}