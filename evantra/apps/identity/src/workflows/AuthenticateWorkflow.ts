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

import {
  Clock,
} from "../platform/Clock";

/**
 * Idle timeout applied to a browser session.
 *
 * A session ends after this much inactivity
 * even though the absolute expiry is far
 * away, which is what makes the security
 * review meaningful.
 *
 * Previously the idle timeout was set to the
 * absolute expiry (30 days), so both dates
 * were identical and the idle window was
 * effectively disabled.
 */
const BROWSER_SESSION_IDLE_MINUTES =
  Number(
    process.env.SESSION_IDLE_TIMEOUT_MINUTES ??
      60 * 24,
  );

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

    private readonly clock: Clock,

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

        /*
         * A real idle window: the session is
         * abandoned after inactivity rather than
         * living for the full absolute lifetime.
         */
        idleTimeoutAt:
          this.clock.afterMinutes(
            BROWSER_SESSION_IDLE_MINUTES,
          ),

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