import { Pool } from "pg";



const CANDIDATE_VARIABLES = [
  "DATABASE_URL",
  "IDENTITY_DATABASE_URL",
  "WORKSPACE_DATABASE_URL",
  "POSTGRES_URL",
] as const;

function resolveDatabaseUrl(): {
  url: string | undefined;
  source: string | undefined;
} {
  for (const name of CANDIDATE_VARIABLES) {
    const value = process.env[name]?.trim();

    if (value) return { url: value, source: name };
  }

  return { url: undefined, source: undefined };
}

const resolved = resolveDatabaseUrl();

export const DATABASE_URL = resolved.url;

export const DATABASE_URL_SOURCE = resolved.source;

if (!DATABASE_URL) {
  /*
   * Logged when the first route imports this
   * file so the server log names the exact
   * problem. workspaceErrorResponse turns a
   * DatabaseConfigError into a 503 with a
   * configuration hint instead of a blank 500.
   */
  console.error(
    "[workspace] No database connection string is set. " +
    "Workspace persistence (plan, burden, promises, knowledge, calendar, finance, organizations) " +
    "cannot connect. Set " +
    CANDIDATE_VARIABLES.join(" or ") +
    " in identity-web's environment (use the same database as the Evantra Identity service).",
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
      "No database connection string is configured for identity-web. " +
        "Set DATABASE_URL (or IDENTITY_DATABASE_URL) to the Evantra Identity database.",
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


let cachedPool: Pool | undefined;

export function getWorkspacePool(): Pool {
  if (!cachedPool) {
    cachedPool = createPool();
  }

  return cachedPool;
}