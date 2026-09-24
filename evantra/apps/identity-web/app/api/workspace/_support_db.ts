import type { Pool } from "pg";

import { getWorkspacePool } from "./_database";

/**
 * Shared database handle for the
 * support / organization layer.
 * Reuses the single workspace pool so the
 * support routes resolve the same connection
 * (and the same missing-config error) as the
 * workspace repository.
 *
 * The Proxy preserves pg's generic query
 * overloads while resolving the pool lazily.
 */
export const supportDatabase = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getWorkspacePool();
    const value = Reflect.get(pool, property) as unknown;
    return typeof value === "function" ? value.bind(pool) : value;
  },
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
