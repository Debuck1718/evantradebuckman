import {
  MembershipStatus,
  OrganizationManager,
  OrganizationRegistry,
  OrganizationStatus,
  type Permission,
} from "@evantra/kernel";

import { supportDatabase } from "./_support_db";

/* ============================================================
   Platform permission keys
   ============================================================ */

/**
 * Every permission the workspace
 * understands. These map 1:1 to
 * the kernel `Permission` model
 * and are seeded on boot.
 */
export const PERMISSIONS = {
  "org:manage": "Manage the organization profile and members.",
  "org:invite": "Invite new members by Evantra ID.",
  "tools:use": "Use the shared organization tools.",
  "tools:manage": "Configure organization tools.",
  "admin:requests": "Review platform support requests.",
  "admin:mail": "Read the platform inbound mailbox.",
  "admin:clients": "Review OAuth client submissions.",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/* ============================================================
   Built-in roles
   ============================================================ */

const ROLE_OWNER: readonly PermissionKey[] = [
  "org:manage",
  "org:invite",
  "tools:use",
  "tools:manage",
  "admin:requests",
  "admin:mail",
  "admin:clients",
];

const ROLE_ADMIN: readonly PermissionKey[] = [
  "org:manage",
  "org:invite",
  "tools:use",
  "tools:manage",
  "admin:requests",
  "admin:mail",
  "admin:clients",
];

const ROLE_MEMBER: readonly PermissionKey[] = [
  "tools:use",
];

/* ============================================================
   Kernel bootstrap
   ============================================================ */

function registerPermissions(manager: OrganizationManager): void {
  for (const [key, description] of Object.entries(PERMISSIONS)) {
    const permission: Permission = {
      id: key,
      key,
      name: key,
      description,
    };
    // Seed once per process; ignore duplicates
    // from hot reloads.
    try {
      manager.registerPermission(permission);
    } catch {
      /* already registered */
    }
  }
}

function registerRoles(manager: OrganizationManager): void {
  const roles = [
    { id: "owner", name: "Owner", permissionIds: ROLE_OWNER },
    { id: "admin", name: "Admin", permissionIds: ROLE_ADMIN },
    { id: "member", name: "Member", permissionIds: ROLE_MEMBER },
  ];

  for (const role of roles) {
    try {
      manager.registerRole(role);
    } catch {
      /* already registered */
    }
  }
}

/**
 * Builds a kernel OrganizationManager
 * hydrated from the workspace database.
 *
 * Every organization, membership and
 * role assignment lives in Postgres;
 * the kernel supplies the domain
 * model, role/permission algebra and
 * the `can()` check.
 */
export async function createOrganizationManager(): Promise<OrganizationManager> {
  const registry = new OrganizationRegistry();
  const manager = new OrganizationManager(registry);

  registerPermissions(manager);
  registerRoles(manager);

  const orgs = await supportDatabase.query<{
    id: string; slug: string; name: string; description: string | null;
    kind: string; created_at: Date;
  }>(
    `SELECT id, slug, name, description, kind, created_at
     FROM workspace.organizations`,
  );

  for (const row of orgs.rows) {
    const organization = manager.createOrganization({
      id: row.id,
      slug: row.slug,
      profile: {
        name: row.name,
        description: row.description ?? undefined,
      },
    });

    if (row.kind === "PLATFORM" || organization.status === "PENDING") {
      manager.activateOrganization(row.id);
    }
  }

  const memberships = await supportDatabase.query<{
    id: string; account_id: string; organization_id: string; role: string;
  }>(
    "SELECT organization_id || ':' || account_id AS id, account_id, organization_id, role FROM workspace.organization_members",
  );

  for (const row of memberships.rows) {
    const roleId =
      row.role === "OWNER" ? "owner" :
      row.role === "ADMIN" ? "admin" : "member";

    try {
      const membership = manager.inviteMember({
        id: row.id,
        userId: row.account_id,
        organizationId: row.organization_id,
        roleIds: [roleId],
      });
      manager.activateMembership(membership.id);
    } catch {
      /* already present from an earlier hydration */
    }
  }

  return manager;
}

/**
 * Authoritative permission check:
 * does `accountId` hold `key` inside
 * `organizationId`?
 *
 * Platform org members with the
 * `admin:*` permissions pass for the
 * platform org only.
 */
export async function canInOrganization(
  organizationId: string,
  accountId: string,
  key: PermissionKey,
): Promise<boolean> {
  const manager = await createOrganizationManager();
  return manager.can(organizationId, accountId, key);
}

/**
 * Convenience: is this account a
 * member of the platform org with
 * a given admin permission?
 */
export async function hasPlatformPermission(
  accountId: string,
  key: PermissionKey,
): Promise<boolean> {
  const org = await supportDatabase.query<{ id: string }>(
    "SELECT id FROM workspace.organizations WHERE slug = 'evantra-team' LIMIT 1",
  );
  if (!org.rows[0]) return false;
  return canInOrganization(org.rows[0].id, accountId, key);
}

export { MembershipStatus, OrganizationStatus };
