import {
  AuthenticationClient,
} from "./AuthenticationClient";

import {
  AuthenticationDevice,
} from "./AuthenticationDevice";

import {
  AuthenticationNetwork,
} from "./AuthenticationNetwork";

import {
  AuthenticationDetails,
} from "./AuthenticationDetails";

/**
 * Represents the complete
 * context of an authentication
 * request.
 *
 * This object is immutable and
 * is created by the application
 * layer from the incoming request.
 *
 * It contains every piece of
 * contextual information required
 * to establish a Browser Session.
 */
export class AuthenticationContext {

  private constructor(

    /**
     * Device information.
     */
    public readonly device:
      AuthenticationDevice,

    /**
     * Network information.
     */
    public readonly network:
      AuthenticationNetwork,

    /**
     * Client information.
     */
    public readonly client:
      AuthenticationClient,

    public readonly details:
    AuthenticationDetails,  

  ) {}

  /**
   * Creates an Authentication
   * Context.
   */
  static create(params: {

  device: AuthenticationDevice;

  network: AuthenticationNetwork;

  client?: AuthenticationClient;

  details: AuthenticationDetails;

}): AuthenticationContext {

  return new AuthenticationContext(

    params.device,

    params.network,

    params.client ??

      AuthenticationClient.create({}),

    params.details,

  );

}

}