import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";

async function main() {

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  const account =
    await identity
      .workflows
      .registerAccount
      .execute({

        evantraId: "evans",

        contactEmail:
          "evans@example.com",

        password:
          "Password123!",

      });

  console.log(account);

  await db.end();

}

main().catch(console.error);