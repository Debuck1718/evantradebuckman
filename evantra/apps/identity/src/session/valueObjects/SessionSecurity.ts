import {
  SessionTrustLevel,
} from "../enums/SessionTrustLevel";

/**
 * Represents the security
 * state of a Browser Session.
 *
 * This object contains only
 * session security information.
 *
 * Risk evaluation belongs to
 * the Risk Engine.
 */
export class SessionSecurity {

  private constructor(

    /**
     * Trust level.
     */
    private trustLevel:
      SessionTrustLevel,

    /**
     * Remember Me enabled.
     */
    private rememberMe: boolean,

    /**
     * Session locked.
     */
    private locked: boolean,

    /**
     * Step-up authentication
     * required.
     */
    private stepUpRequired: boolean,

    /**
     * Continuous validation.
     */
    private continuousValidation: boolean,

    /**
     * Cookie schema version.
     */
    public readonly cookieVersion: number,

    /**
     * Signing key version.
     */
    public readonly keyVersion: number,

    /**
     * Session schema version.
     */
    public readonly sessionVersion: number,

  ) {}

  /**
   * Creates a new
   * Session Security state.
   */
  static create(params: {

    trustLevel?: SessionTrustLevel;

    rememberMe?: boolean;

    continuousValidation?: boolean;

    cookieVersion?: number;

    keyVersion?: number;

    sessionVersion?: number;

  }): SessionSecurity {

    return new SessionSecurity(

      params.trustLevel ??
        SessionTrustLevel.UNKNOWN,

      params.rememberMe ??
        false,

      false,

      false,

      params.continuousValidation ??
        true,

      params.cookieVersion ??
        1,

      params.keyVersion ??
        1,

      params.sessionVersion ??
        1,

    );

  }

  /**
   * Restores persisted state.
   */
  static restore(params: {

    trustLevel: SessionTrustLevel;

    rememberMe: boolean;

    locked: boolean;

    stepUpRequired: boolean;

    continuousValidation: boolean;

    cookieVersion: number;

    keyVersion: number;

    sessionVersion: number;

  }): SessionSecurity {

    return new SessionSecurity(

      params.trustLevel,

      params.rememberMe,

      params.locked,

      params.stepUpRequired,

      params.continuousValidation,

      params.cookieVersion,

      params.keyVersion,

      params.sessionVersion,

    );

  }

  /**
   * Returns true when
   * Remember Me is enabled.
   */
  remembers(): boolean {

    return this.rememberMe;

  }

  /**
   * Enables Remember Me.
   */
  enableRememberMe(): void {

    this.rememberMe = true;

  }

  /**
   * Disables Remember Me.
   */
  disableRememberMe(): void {

    this.rememberMe = false;

  }

  /**
   * Returns the current
   * trust level.
   */
  trust(): SessionTrustLevel {

    return this.trustLevel;

  }

  /**
   * Updates trust level.
   */
  updateTrust(
    trustLevel: SessionTrustLevel,
  ): void {

    this.trustLevel =
      trustLevel;

  }

  /**
   * Locks the session.
   */
  lock(): void {

    this.locked = true;

  }

  /**
   * Unlocks the session.
   */
  unlock(): void {

    this.locked = false;

  }

  /**
   * Returns true if the
   * session is locked.
   */
  isLocked(): boolean {

    return this.locked;

  }

  /**
   * Requires step-up
   * authentication.
   */
  requireStepUp(): void {

    this.stepUpRequired = true;

  }

  /**
   * Clears step-up
   * authentication.
   */
  clearStepUp(): void {

    this.stepUpRequired = false;

  }

  

  /**
   * Returns true if
   * step-up authentication
   * is required.
   */
  requiresStepUp(): boolean {

    return this.stepUpRequired;

  }

  /**
   * Returns true if
   * continuous validation
   * is enabled.
   */
  usesContinuousValidation(): boolean {

    return this.continuousValidation;

  }

}