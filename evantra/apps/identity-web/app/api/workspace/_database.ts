import { Pool } from "pg";



export const CANDIDATE_VARIABLES = [
  "DATABASE_URL",
  "IDENTITY_DATABASE_URL",
  "WORKSPACE_DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRESQL_URL",
  "RENDER_DATABASE_URL",
] as const;

/**
 * Normalises a raw environment value into a
 * usable connection string.
 *
 * Render (and copy/paste from dashboards)
 * frequently yields values that are subtly
 * unusable: surrounding quotes, a trailing
 * newline, an "export " prefix, or a
 * psql-style "postgres://" scheme that some
 * drivers reject. A value that only looks
 * present but cannot be parsed produced the
 * exact "storage is not configured" 503 the
 * routes were reporting, so the value is
 * cleaned here rather than trusted blindly.
 */
function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }

  return value;
}

function normalizeDatabaseUrl(raw: string): string | undefined {
  let value = raw.trim();

  if (!value) return undefined;

  if (value.startsWith("export ")) {
    value = value.slice("export ".length).trim();
  }

  /*
   * Strip a variable-name prefix left over from
   * pasting "DATABASE_URL=postgres://...". This
   * runs BEFORE quote stripping because the most
   * common bad value is exactly
   *   DATABASE_URL="postgres://..."
   * where the quotes only become the outermost
   * characters once the NAME= prefix is gone.
   */
  const assignment = value.match(/^[A-Za-z0-9_]+\s*=\s*([\s\S]+)$/);

  if (assignment) {
    value = assignment[1].trim();
  }

  value = stripWrappingQuotes(value);

  if (!value) return undefined;

  if (
    !value.startsWith("postgres://") &&
    !value.startsWith("postgresql://")
  ) {
    return undefined;
  }

  return value;
}

function resolveDatabaseUrl(): {
  url: string | undefined;
  source: string | undefined;
} {
  for (const name of CANDIDATE_VARIABLES) {
    const raw = process.env[name];

    if (typeof raw !== "string") continue;

    const value = normalizeDatabaseUrl(raw);

    if (value) return { url: value, source: name };
  }

  return { url: undefined, source: undefined };
}

/**
 * Names the candidate variables that are
 * present but unusable, so the Render log
 * distinguishes "not set" from "set to
 * something that is not a postgres URL".
 * Values are never logged.
 */
function describeInvalidCandidates(): string {
  const invalid = CANDIDATE_VARIABLES.filter(name => {
    const raw = process.env[name];

    return typeof raw === "string" && raw.trim().length > 0;
  });

  return invalid.length > 0
    ? ` Present but not a usable postgres URL: ${invalid.join(", ")}.`
    : " None of them are set in this service's environment.";
}

/*
 * Resolution is deliberately lazy. Reading the
 * environment once at module load froze the
 * first value the process ever saw, so a
 * variable added or corrected after boot (or a
 * stale instance) kept answering 503 even
 * though the dashboard showed it configured.
 * Resolving per call means a redeploy, or even
 * a corrected value, takes effect immediately.
 */
export function getDatabaseUrl(): string | undefined {
  return resolveDatabaseUrl().url;
}

export function getDatabaseUrlSource(): string | undefined {
  return resolveDatabaseUrl().source;
}

/**
 * Back-compat named exports. These are
 * evaluated at import time for any consumer
 * that still reads them directly; new code
 * should call getDatabaseUrl().
 */
export const DATABASE_URL = getDatabaseUrl();

export const DATABASE_URL_SOURCE = getDatabaseUrlSource();

export class DatabaseConfigError extends Error {
  readonly code = "DATABASE_CONFIG";
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

function createPool(): Pool {
  const url = getDatabaseUrl();

  if (!url) {
    /*
     * Logged once per attempt (not once per
     * process) so the message always reflects
     * the current environment and names whether
     * the variables are missing or malformed.
     */
    console.error(
      "[workspace] No usable database connection string is set. " +
        "Workspace persistence (plan, burden, promises, knowledge, calendar, finance, organizations) " +
        "cannot connect. Expected one of " +
        CANDIDATE_VARIABLES.join(", ") +
        " in identity-web's environment (use the same database as the Evantra Identity service)." +
        describeInvalidCandidates(),
    );

    throw new DatabaseConfigError(
      "No database connection string is configured for identity-web. " +
        "Set DATABASE_URL (or IDENTITY_DATABASE_URL) to the Evantra Identity database.",
    );
  }

  return new Pool({
    connectionString: url,
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