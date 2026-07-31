import { Pool } from "pg";

/**
 * Shared PostgreSQL connection pool
 * for the Evantra Account Platform.
 */
export const postgres = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});