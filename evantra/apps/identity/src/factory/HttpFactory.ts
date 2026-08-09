import { WorkflowFactory } from "./WorkflowFactory";
import { PlatformFactory } from "./PlatformFactory";

import { AuthorizationController } from "../http/controllers/AuthorizationController";
import { TokenController } from "../http/controllers/TokenController";
import { RevokeTokenController } from "../http/controllers/RevokeTokenController";
import { IntrospectTokenController } from "../http/controllers/IntrospectTokenController";

import { AuthorizationCodeGrantHandler } from "../http/oauth/grants/AuthorizationCodeGrantHandler";
import { RefreshTokenGrantHandler } from "../http/oauth/grants/RefreshTokenGrantHandler";
import { TokenGrantDispatcher } from "../http/oauth/grants/TokenGrantDispatcher";

import { OAuthConfiguration } from "../http/oauth/OAuthConfiguration";

type WorkflowRegistry =
  ReturnType<typeof WorkflowFactory.create>;

type PlatformRegistry =
  ReturnType<typeof PlatformFactory.create>;

/**
 * Builds the complete HTTP layer.
 *
 * Every HTTP dependency is created
 * here exactly once.
 */
export class HttpFactory {

  static create(

    workflows: WorkflowRegistry,

    platform: PlatformRegistry,

  ) {

    // ==========================================================
    // OAuth Configuration
    // ==========================================================

    const oauthConfiguration: OAuthConfiguration = {

      accessTokenLifetime:
        platform.security.accessTokenLifetime,

      refreshTokenLifetime:
        platform.security.refreshTokenLifetime,

    };

    // ==========================================================
    // OAuth Grant Handlers
    // ==========================================================

    const authorizationCodeGrant =
      new AuthorizationCodeGrantHandler(

        workflows.oauth.exchangeAuthorizationCode,

        oauthConfiguration,

      );

    const refreshTokenGrant =
      new RefreshTokenGrantHandler(

        workflows.oauth.refreshAccessToken,

        oauthConfiguration,

      );

    // ==========================================================
    // OAuth Dispatcher
    // ==========================================================

    const tokenDispatcher =
      new TokenGrantDispatcher([

        authorizationCodeGrant,

        refreshTokenGrant,

      ]);

    // ==========================================================
    // OAuth Controllers
    // ==========================================================

    const authorizationController =
      new AuthorizationController(

        workflows.oauth.authorize,

      );

    const tokenController =
      new TokenController(

        tokenDispatcher,

      );

    const revokeTokenController =
  new RevokeTokenController(
    workflows.oauth.revokeToken,
  );

const introspectTokenController =
  new IntrospectTokenController(
    workflows.oauth.introspectToken,
  );  

    // ==========================================================
    // HTTP Registry
    // ==========================================================

    return {

      oauth: {

        configuration:
          oauthConfiguration,

        controllers: {

          authorization:
            authorizationController,

          token:
            tokenController,

          revokeToken:
              revokeTokenController,  
              
          introspectToken:
              introspectTokenController,
        },

        grants: {

          authorizationCode:
            authorizationCodeGrant,

          refreshToken:
            refreshTokenGrant,

          dispatcher:
            tokenDispatcher,

        },

      },

      identity: {

        // register
        // authenticate
        // verify
        // logout

      },

      clients: {

        // register
        // redirectUris

      },

      oidc: {

        // discovery
        // jwks
        // userInfo

      },

    };

  }

}