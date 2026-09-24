import { Pool } from "pg";

/**
 * Single PostgreSQL pool for every workspace
 * API route.
 *
 * Every workspace route (plan, burden,
 * promises, knowledge, calendar, finance) plus
 * the support / organization layer resolved
 * their own `pg.Pool` straight from
 * `process.env.DATABASE_URL`. When that
 * variable was missing the pool silently fell
 * back to a localhost connection, every query
 * failed, and each route answered with the
 * same opaque 500. That is what turned a
 * first plan load into a wall of 500s.
 *
 * Configuring the pool once, and failing with
 * a message that names the missing variable,
 * keeps the failure diagnosable instead of
 * surfacing as a generic "unable to load".
 */

export const DATABASE_URL = process.env.DATABASE_URL?.trim();

if (!DATABASE_URL) {
  /*
   * Thrown at module load (i.e. when the first
   * route imports this file) so the server log
   * names the exact problem. workspaceErrorResponse
   * turns a DatabaseConfigError into a 503 with a
   * configuration hint instead of a blank 500.
   */
  console.error(
    "[workspace] DATABASE_URL is not set. " +
    "Workspace persistence (plan, burden, promises, knowledge, calendar, finance, organizations) " +
    "cannot connect. Set DATABASE_URL in identity-web's environment.",
  );
}

export class DatabaseConfigError extends Error {
  readonly code = "DATABASE_CONFIG";
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

function createPool(): Pool {
  if (!DATABASE_URL) {
    throw new DatabaseConfigError(
      "DATABASE_URL is not configured for identity-web.",
    );
  }

  return new Pool({
    connectionString: DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
    max: 10,
  });
}

/**
 * The shared pool.
 *
 * Created lazily and memoised: importing a
 * route must not open a socket at build time,
 * and a missing DATABASE_URL must surface as a
 * catchable DatabaseConfigError when the route
 * actually runs, not as a hard module-load
 * crash that breaks `next build`.
 */
let cachedPool: Pool | undefined;

export function getWorkspacePool(): Pool {
  if (!cachedPool) {
    cachedPool = createPool();
  }

  return cachedPool;
}