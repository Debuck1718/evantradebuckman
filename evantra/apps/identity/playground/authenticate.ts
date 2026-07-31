import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";
import { EvantraId } from "../src/account";

async function main() {

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  const result =
    await identity
      .workflows
      .authenticate
      .execute({

        evantraId:
          EvantraId.from("evans"),

        password:
          "Password123!",

      });

  console.log(
    "Authenticated Account"
  );

  console.log(result.account);

  console.log();

  console.log(
    "Created Session"
  );

  console.log(result.session);

  await db.end();

}

main().catch(console.error);