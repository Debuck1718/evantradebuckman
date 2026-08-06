import {
  Account,
  EvantraId,
} from "../account";

import {
  AuthenticationContext,
  AuthenticationService,
} from "../authentication";

import {
  BrowserSession,
  BrowserSessionFactory,
  BrowserSessionService,
  Session,
  SessionService,
} from "../session";

import {

  AuditAction,

  AuditSeverity,

  AuditService,

} from "../audit";

/**
 * Coordinates user authentication.
 *
 * This workflow authenticates an
 * Evantra Account, starts an
 * authenticated Session and
 * establishes a Browser Session.
 */
export class AuthenticateWorkflow {

  constructor(

    private readonly authentication:
      AuthenticationService,

    private readonly sessions:
      SessionService,

    private readonly browserSessions:
      BrowserSessionService,

     private readonly audit:
  AuditService, 

  ) {}

  /**
   * Authenticates a user and
   * establishes both the
   * application Session and the
   * Browser Session.
   */
  async execute(params: {

    evantraId: EvantraId;

    password: string;

    context: AuthenticationContext;

  }): Promise<{

    account: Account;

    session: Session;

    browserSession: BrowserSession;

  }> {

    // ========================================================
    // Authenticate
    // ========================================================

    const account =
      await this.authentication.authenticate({

        evantraId:
          params.evantraId,

        password:
          params.password,

      });

    // ========================================================
    // Create lightweight Session
    // ========================================================

    const session =
      await this.sessions.start(

        account.id,

      );

    // ========================================================
    // Create Browser Session
    // ========================================================

    const browserSession =
      BrowserSessionFactory.create({

        account,

        sessionId:
          session.id,

        context:
          params.context,

        expiresAt:
          session.expiresAt,

        idleTimeoutAt:
          session.expiresAt,

      });

    // ========================================================
    // Persist Browser Session
    // ========================================================

    await this.browserSessions.create(

      browserSession,

    );

    await this.audit.record({

  accountId:

    account.id,

  action:

    AuditAction.LOGIN_SUCCESS,

  severity:

    AuditSeverity.INFO,

});

    // ========================================================
    // Result
    // ========================================================

    return {

      account,

      session,

      browserSession,

    };


  }

  

}