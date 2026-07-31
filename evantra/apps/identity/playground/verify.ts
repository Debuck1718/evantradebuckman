import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";

async function main() {

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  // Retrieve the latest verification token.
  const result =
    await db.query(
      `
      SELECT token
      FROM identity.verifications
      ORDER BY created_at DESC
      LIMIT 1
      `
    );

  if (result.rowCount === 0) {
    throw new Error(
      "No verification request found."
    );
  }

  const token =
    result.rows[0].token;

  console.log(
    "Verification Token:",
    token
  );

  await identity
    .workflows
    .verifyAccount
    .execute(token);

  console.log(
    "Account verified successfully."
  );

  await db.end();

}

main().catch(console.error);