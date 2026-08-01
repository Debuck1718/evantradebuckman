import { z } from "zod";

export const RefreshTokenGrantSchema =
  z.object({

    grant_type:
      z.literal(
        "refresh_token",
      ),

    client_id:
      z.string().min(1),

    client_secret:
      z.string().optional(),

    refresh_token:
      z.string().min(1),

  });

export type RefreshTokenGrantRequest =
  z.infer<
    typeof RefreshTokenGrantSchema
  >;