import {
  AuthenticationLevel,
} from "../../session/enums/AuthenticationLevel";

import {
  AuthenticationMethod,
} from "../../session/enums/AuthenticationMethod";

import {
  MfaMethod,
} from "../../session/enums/MfaMethod";

/**
 * Represents how an
 * authentication request
 * was performed.
 *
 * This is an immutable snapshot
 * created during authentication.
 */
export class AuthenticationDetails {

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
     * MFA method used.
     */
    public readonly mfaMethod:
      MfaMethod,

    /**
     * Remember Me requested.
     */
    public readonly rememberMe: boolean,

    /**
     * Step-up authentication.
     */
    public readonly stepUp: boolean,

  ) {}

  /**
   * Creates Authentication Details.
   */
  static create(params: {

    method: AuthenticationMethod;

    level: AuthenticationLevel;

    mfaMethod?: MfaMethod;

    rememberMe?: boolean;

    stepUp?: boolean;

  }): AuthenticationDetails {

    return new AuthenticationDetails(

      params.method,

      params.level,

      params.mfaMethod ??

        MfaMethod.NONE,

      params.rememberMe ??

        false,

      params.stepUp ??

        false,

    );

  }

}