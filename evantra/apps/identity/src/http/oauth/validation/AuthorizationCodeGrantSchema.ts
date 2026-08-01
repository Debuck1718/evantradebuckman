import { z } from "zod";

export const AuthorizationCodeGrantSchema =
  z.object({

    grant_type:
      z.literal(
        "authorization_code",
      ),

    client_id:
      z.string().min(1),

    client_secret:
      z.string().optional(),

    code:
      z.string().min(1),

    redirect_uri:
      z.string().url(),

    code_verifier:
      z.string().optional(),

  });

export type AuthorizationCodeGrantRequest =
  z.infer<
    typeof AuthorizationCodeGrantSchema
  >;