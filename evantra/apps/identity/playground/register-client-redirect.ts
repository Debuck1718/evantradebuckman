import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";

async function main() {

  const ownerAccountId =
    process.env.OWNER_ACCOUNT_ID?.trim();

  if (!ownerAccountId) {
    throw new Error(
      "OWNER_ACCOUNT_ID is required to register a redirect URI.",
    );
  }

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  const redirect =
    await identity
      .workflows
      .registerClientRedirectUri
      .execute({

        clientId:
          "01KYNV1RSYK0H4Q189EMBA9XNS",

        ownerAccountId,

        redirectUri:
          "https://storeforge-e2gi.vercel.app/",

        primary: true,

      });

  console.log("Redirect URI Registered");

  console.log(redirect);

  await db.end();

}

main().catch(console.error);