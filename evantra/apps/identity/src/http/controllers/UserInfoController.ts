import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  UserInfoWorkflow,
} from "../../workflows/UserInfoWorkflow";

/**
 * OAuth UserInfo Controller.
 *
 * Resolves authenticated user information
 * from a valid OAuth access token.
 */
export class UserInfoController {

  constructor(
    private readonly workflow:
      UserInfoWorkflow,
  ) {}

  /**
   * GET /oauth/userinfo
   *
   * Authorization:
   *   Bearer <access_token>
   */
  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {

    try {

      const authorization =
        request.headers.authorization;

      if (
        !authorization ||
        !authorization.startsWith(
          "Bearer ",
        )
      ) {

        response
          .status(401)
          .json({

            error:
              "invalid_token",

            error_description:
              "A valid Bearer access token is required.",

          });

        return;

      }

      const accessToken =
        authorization
          .slice("Bearer ".length)
          .trim();

      if (!accessToken) {

        response
          .status(401)
          .json({

            error:
              "invalid_token",

            error_description:
              "A valid Bearer access token is required.",

          });

        return;

      }

      const account =
        await this.workflow.execute(
          accessToken,
        );

      response
        .status(200)
        .json({

          sub:
            account.id,

          evantra_id:
            account.evantraId.value,

          first_name:
            account.firstName,

          last_name:
            account.lastName,

          email:
            account.contactEmail.value,

        });

    } catch (error) {

      next(error);

    }

  }

}