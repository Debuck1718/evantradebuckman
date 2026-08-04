import {
  IdentityModule,
} from "./IdentityModule";

/**
 * Root Evantra application.
 *
 * Every bounded context is
 * composed here.
 */
export class Application {

  /**
   * Creates the application.
   */
  static create() {

    return {

      identity:

        IdentityModule.create(),

    };

  }

}