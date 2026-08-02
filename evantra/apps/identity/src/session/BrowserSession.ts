import {
  SessionIdentity,
} from "./valueObjects/SessionIdentity";

import {
  SessionAuthentication,
} from "./valueObjects/SessionAuthentication";

import {
  SessionDevice,
} from "./valueObjects/SessionDevice";

import {
  SessionNetwork,
} from "./valueObjects/SessionNetwork";

import {
  SessionSecurity,
} from "./valueObjects/SessionSecurity";

import {
  SessionLifecycle,
} from "./valueObjects/SessionLifecycle";

import {
  EvantraId,
} from "../account";

/**
 * Represents an authenticated
 * browser session.
 *
 * This is the aggregate root
 * of the Session module.
 */
export class BrowserSession {

  private constructor(

    public readonly identity:
      SessionIdentity,

    public readonly authentication:
      SessionAuthentication,

    public readonly device:
      SessionDevice,

    public readonly network:
      SessionNetwork,

    public readonly security:
      SessionSecurity,

    public readonly lifecycle:
      SessionLifecycle,

  ) {}

  /**
   * Creates a new
   * Browser Session.
   */
  static create(params: {

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): BrowserSession {

    return new BrowserSession(

      params.identity,

      params.authentication,

      params.device,

      params.network,

      params.security,

      params.lifecycle,

    );

  }

  /**
   * Restores a persisted
   * Browser Session.
   */
  static restore(params: {

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): BrowserSession {

    return new BrowserSession(

      params.identity,

      params.authentication,

      params.device,

      params.network,

      params.security,

      params.lifecycle,

    );

  }

  /**
   * Updates session activity.
   */
  touch(
    idleTimeoutAt: Date,
  ): void {

    this.lifecycle.touch(
      idleTimeoutAt,
    );

    this.device.touch();

  }

  /**
   * Revokes the session.
   */
  revoke(): void {

    this.lifecycle.revoke();

  }

  /**
   * Terminates the session.
   */
  terminate(): void {

    this.lifecycle.terminate();

  }

  /**
   * Locks the session.
   */
  lock(): void {

    this.security.lock();

  }

  /**
   * Unlocks the session.
   */
  unlock(): void {

    this.security.unlock();

  }

  /**
   * Marks the device
   * as trusted.
   */
  trustDevice(): void {

    this.device.markTrusted();

  }

  /**
   * Removes device trust.
   */
  revokeDeviceTrust(): void {

    this.device.revokeTrust();

  }

  /**
   * Requires step-up
   * authentication.
   */
  requireStepUp(): void {

    this.authentication.requireStepUp();

    this.security.requireStepUp();

  }

  /**
   * Clears step-up
   * authentication.
   */
  completeStepUp(): void {

    this.authentication.clearStepUp();

    this.authentication.verify();

    this.security.clearStepUp();

  }

  /**
   * Completes MFA.
   */
  verifyMfa(): void {

    this.authentication.verifyMfa();

  }

  /**
   * Returns true if the
   * Browser Session can
   * be used.
   */
  isActive(): boolean {

    return (

      this.lifecycle.isActive()

      &&

      !this.security.isLocked()

    );

  }

  /**
   * Returns true when
   * step-up authentication
   * is required.
   */
  requiresStepUp(): boolean {

    return (

      this.authentication.requiresStepUp()

      ||

      this.security.requiresStepUp()

    );

  }

  /**
   * Returns true when the
   * Browser Session belongs
   * to an Evantra.
   */
  belongsToEvantraId(
  evantraId: EvantraId,
): boolean {

  return this.identity
    .belongsToEvantraId(
      evantraId,
    );

}

}