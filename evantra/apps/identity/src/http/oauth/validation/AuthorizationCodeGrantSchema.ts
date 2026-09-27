import { z } from "zod";

export const AuthorizationCodeGrantSchema =
  z.object({
    grant_type:
      z.literal("authorization_code"),

    client_id:
      z.string().min(1),

    client_secret:
      z.string().optional(),

    code:
      z.string().min(1),

    redirect_uri:
      /*
       * z.string().url(), deliberately.
       *
       * Zod delegates to the WHATWG URL parser, which
       * DOES accept custom-scheme URIs like
       * `com.livo.app://oauth/callback` — verified, not
       * assumed. So this is not a blocker for native apps.
       *
       * Left as `.url()` to keep rejecting genuinely
       * malformed values. The real check is the verbatim
       * comparison against the registered redirect in
       * ExchangeAuthorizationCodeWorkflow; registration
       * is the allow-list.
       */
      z.string().url(),

    code_verifier:
      z.string().min(1),
  });

export type AuthorizationCodeGrantRequest =
  z.infer<
    typeof AuthorizationCodeGrantSchema
  >;