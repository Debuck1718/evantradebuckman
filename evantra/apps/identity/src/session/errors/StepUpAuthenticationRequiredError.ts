import { SessionError } from "./SessionError";

/**
 * Additional authentication
 * is required before
 * continuing.
 */
export class StepUpAuthenticationRequiredError
  extends SessionError {

  constructor() {

    super(

      "step_up_authentication_required",

      "Step-up authentication is required.",

    );

  }

}