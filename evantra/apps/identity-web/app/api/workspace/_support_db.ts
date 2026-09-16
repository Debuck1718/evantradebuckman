import { Pool } from "pg";

/**
 * Shared database pool for the
 * support / organization layer.
 * Reuses the same connection
 * settings as the workspace
 * repository.
 */
export const supportDatabase = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
});

/**
 * The single platform-level
 * organization that manages the
 * Evantra workspace itself.
 * Members of this organization
 * are the operators with admin
 * access.
 */
export const PLATFORM_ORG_SLUG = "evantra-team";

export const PLATFORM_ORG_NAME = "Evantra Team";
