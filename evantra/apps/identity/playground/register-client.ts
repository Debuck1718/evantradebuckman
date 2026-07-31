import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";

async function main() {

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  // Use the account you registered earlier.
  const ownerAccountId =
    "01KYNP7KJHR5X1P3C5JS42XTH0";

  const result =
    await identity
      .workflows
      .registerClient
      .execute({

        ownerAccountId,

        name:
          "StoreForge",

        slug:
          "storeforge",

        homepageUrl:
          "https://storeforge.evantra.com",

        description:
          "Modern multi-tenant commerce platform.",

        firstParty: true,

      });

  console.log();

  console.log("===================================");

  console.log("Client Registered");

  console.log("===================================");

  console.log();

  console.log("Internal ID:");

  console.log(result.client.id);

  console.log();

  console.log("Client ID:");

  console.log(result.client.clientId.value());

  console.log();

  console.log("Client Secret");

  console.log(result.clientSecret);

  console.log();

  console.log("Status:");

  console.log(result.client.getStatus());

  await db.end();

}

main().catch(console.error);