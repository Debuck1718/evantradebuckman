import "../src/bootstrap";

import { postgres } from "../infrastructure/database/Postgres";

async function main() {

  const result = await postgres.query(
    "select version()"
  );

  console.log(result.rows[0]);

  await postgres.end();
}

main().catch(console.error);