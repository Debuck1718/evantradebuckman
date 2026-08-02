import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  EvantraId,
} from "../account";

/**
 * Returns every Browser
 * Session belonging to
 * an Evantra Identity.
 */
export class ListBrowserSessionsWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Returns every Browser
   * Session.
   */
  async execute(params: {

    evantraId: EvantraId;

  }): Promise<BrowserSession[]> {

    return this.sessions.findByEvantraId(

      params.evantraId,

    );

  }

}