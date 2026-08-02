import {
  AuthenticationLevel,
} from "../enums/AuthenticationLevel";

import {
  AuthenticationMethod,
} from "../enums/AuthenticationMethod";

/**
 * Represents the authentication
 * state of a Browser Session.
 *
 * This object records how the
 * session was authenticated.
 *
 * It never stores credentials.
 */
export class SessionAuthentication {

  private constructor(

    /**
     * Primary authentication method.
     */
    public readonly method:
      AuthenticationMethod,

    /**
     * Authentication Assurance Level.
     */
    public readonly level:
      AuthenticationLevel,

    /**
     * Authentication timestamp.
     */
    public readonly authenticatedAt:
      Date,

    /**
     * Multi-factor authentication
     * has been satisfied.
     */
    private mfaVerified: boolean,

    /**
     * Additional authentication
     * is currently required.
     */
    private stepUpRequired: boolean,

    /**
     * Session has been fully
     * verified.
     */
    private verified: boolean,

  ) {}

  /**
   * Creates a new authentication
   * state.
   */
  static create(params: {

    method: AuthenticationMethod;

    level: AuthenticationLevel;

    authenticatedAt?: Date;

    mfaVerified?: boolean;

    stepUpRequired?: boolean;

    verified?: boolean;

  }): SessionAuthentication {

    return new SessionAuthentication(

      params.method,

      params.level,

      params.authenticatedAt ??
        new Date(),

      params.mfaVerified ??
        false,

      params.stepUpRequired ??
        false,

      params.verified ??
        true,

    );

  }

  /**
   * Restores a persisted
   * authentication state.
   */
  static restore(params: {

    method: AuthenticationMethod;

    level: AuthenticationLevel;

    authenticatedAt: Date;

    mfaVerified: boolean;

    stepUpRequired: boolean;

    verified: boolean;

  }): SessionAuthentication {

    return new SessionAuthentication(

      params.method,

      params.level,

      new Date(
        params.authenticatedAt,
      ),

      params.mfaVerified,

      params.stepUpRequired,

      params.verified,

    );

  }

  /**
   * Returns true when
   * MFA has been completed.
   */
  isMfaVerified(): boolean {

    return this.mfaVerified;

  }

  /**
   * Marks MFA as completed.
   */
  verifyMfa(): void {

    this.mfaVerified = true;

  }

  /**
   * Returns true when
   * additional authentication
   * is required.
   */
  requiresStepUp(): boolean {

    return this.stepUpRequired;

  }

  /**
   * Requires step-up
   * authentication.
   */
  requireStepUp(): void {

    this.stepUpRequired = true;

    this.verified = false;

  }

  /**
   * Clears step-up
   * authentication.
   */
  clearStepUp(): void {

    this.stepUpRequired = false;

  }

  /**
   * Marks this session as
   * fully verified.
   */
  verify(): void {

    this.verified = true;

  }

  /**
   * Returns true if the
   * authentication is trusted.
   */
  isVerified(): boolean {

    return this.verified;

  }

}