import {
  PLATFORM_ORG_NAME,
  PLATFORM_ORG_SLUG,
  supportDatabase,
} from "./_support_db";

/* ============================================================
   Types
   ============================================================ */

export type SupportStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";
export type OrgRole = "OWNER" | "ADMIN" | "MEMBER";

export interface SupportRequest {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: SupportStatus;
  adminReply: string | null;
  createdAt: string;
}

export interface AdminSupportRequest extends SupportRequest {
  accountId: string;
  contactEmail: string;
  workspaceId: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  kind: "ORGANIZATION" | "PLATFORM";
  description: string | null;
  role: OrgRole;
  memberCount: number;
  createdAt: string;
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  organizationName: string;
  evantraId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "REVOKED";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

/* ============================================================
   Notification helpers
   ============================================================ */

export async function notify(params: {
  accountId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}): Promise<void> {
  await supportDatabase.query(
    `INSERT INTO workspace.notifications (account_id, type, title, body, link)
     VALUES ($1, $2, $3, $4, $5)`,
    [params.accountId, params.type, params.title, params.body ?? null, params.link ?? null],
  );
}

async function notifyOrganization(
  organizationId: string,
  params: { type: string; title: string; body?: string; link?: string; exceptAccountId?: string },
): Promise<void> {
  await supportDatabase.query(
    `INSERT INTO workspace.notifications (account_id, type, title, body, link)
     SELECT account_id, $2, $3, $4, $5
     FROM workspace.organization_members
     WHERE organization_id = $1
       AND ($6::varchar IS NULL OR account_id <> $6)`,
    [
      organizationId,
      params.type,
      params.title,
      params.body ?? null,
      params.link ?? null,
      params.exceptAccountId ?? null,
    ],
  );
}

/* ============================================================
   Platform organization (Evantra Team)
   ============================================================ */

export async function ensurePlatformOrganization(): Promise<string> {
  const existing = await supportDatabase.query<{ id: string }>(
    "SELECT id FROM workspace.organizations WHERE slug = $1 LIMIT 1",
    [PLATFORM_ORG_SLUG],
  );
  if (existing.rows[0]) return existing.rows[0].id;

  const created = await supportDatabase.query<{ id: string }>(
    `INSERT INTO workspace.organizations (name, slug, kind, description, creator_id)
     VALUES ($1, $2, 'PLATFORM', $3, '_system')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [PLATFORM_ORG_NAME, PLATFORM_ORG_SLUG, "Platform operators managing the Evantra workspace."],
  );

  if (created.rows[0]) return created.rows[0].id;

  const afterRace = await supportDatabase.query<{ id: string }>(
    "SELECT id FROM workspace.organizations WHERE slug = $1 LIMIT 1",
    [PLATFORM_ORG_SLUG],
  );
  if (!afterRace.rows[0]) throw new Error("Unable to resolve the platform organization.");
  return afterRace.rows[0].id;
}

/**
 * Platform membership is granted by inviting the account
 * into the Evantra Team organization (same invite flow as
 * any other organization). There is no env-based backdoor.
 */
export async function isPlatformOperator(accountId: string): Promise<boolean> {
  const result = await supportDatabase.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1
       FROM workspace.organization_members AS m
       JOIN workspace.organizations AS o ON o.id = m.organization_id
       WHERE o.slug = $1 AND m.account_id = $2
     ) AS exists`,
    [PLATFORM_ORG_SLUG, accountId],
  );
  return result.rows[0]?.exists === true;
}

/* ============================================================
   Support requests
   ============================================================ */

export async function createSupportRequest(
  accountId: string,
  input: {
    contactEmail: string;
    category: string;
    subject: string;
    message: string;
  },
): Promise<SupportRequest> {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await supportDatabase.query<{
    id: string; category: string; subject: string; message: string;
    status: SupportStatus; admin_reply: string | null; created_at: Date;
  }>(
    `INSERT INTO workspace.support_requests
       (workspace_id, account_id, contact_email, category, subject, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, category, subject, message, status, admin_reply, created_at`,
    [workspaceId, accountId, input.contactEmail, input.category, input.subject, input.message],
  );

  const row = result.rows[0];

  // Notify every platform operator that a new request arrived.
  const platformOrgId = await ensurePlatformOrganization();
  await notifyOrganization(platformOrgId, {
    type: "support.request.created",
    title: "New support request",
    body: `${input.subject}`,
    link: "/admin/requests",
    exceptAccountId: accountId,
  });

  return {
    id: row.id,
    category: row.category,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminReply: row.admin_reply,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listSupportRequestsFor(accountId: string): Promise<SupportRequest[]> {
  const result = await supportDatabase.query<{
    id: string; category: string; subject: string; message: string;
    status: SupportStatus; admin_reply: string | null; created_at: Date;
  }>(
    `SELECT id, category, subject, message, status, admin_reply, created_at
     FROM workspace.support_requests
     WHERE account_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [accountId],
  );

  return result.rows.map(row => ({
    id: row.id,
    category: row.category,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminReply: row.admin_reply,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function listAllSupportRequests(): Promise<AdminSupportRequest[]> {
  const result = await supportDatabase.query<{
    id: string; category: string; subject: string; message: string;
    status: SupportStatus; admin_reply: string | null; created_at: Date;
    account_id: string; contact_email: string; workspace_id: string;
  }>(
    `SELECT id, category, subject, message, status, admin_reply, created_at,
            account_id, contact_email, workspace_id
     FROM workspace.support_requests
     ORDER BY (status = 'OPEN') DESC, created_at DESC
     LIMIT 200`,
  );

  return result.rows.map(row => ({
    id: row.id,
    category: row.category,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminReply: row.admin_reply,
    createdAt: row.created_at.toISOString(),
    accountId: row.account_id,
    contactEmail: row.contact_email,
    workspaceId: row.workspace_id,
  }));
}

export async function resolveSupportRequest(
  adminAccountId: string,
  id: string,
  status: Exclude<SupportStatus, "OPEN">,
  adminReply?: string,
): Promise<void> {
  const result = await supportDatabase.query<{ account_id: string }>(
    `UPDATE workspace.support_requests
     SET status = $1, admin_reply = COALESCE($2, admin_reply),
         resolved_at = CASE WHEN $1 IN ('RESOLVED','DISMISSED') THEN NOW() ELSE NULL END,
         resolved_by = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING account_id`,
    [status, adminReply ?? null, adminAccountId, id],
  );

  if (!result.rows[0]) throw new Error("Support request not found.");

  await notify({
    accountId: result.rows[0].account_id,
    type: `support.request.${status.toLowerCase()}`,
    title: `Support request ${status.toLowerCase().replace("_", " ")}`,
    body: adminReply ?? undefined,
    link: "/workspace/support",
  });
}

/* ============================================================
   Organizations
   ============================================================ */

export async function createOrganization(
  accountId: string,
  input: { name: string; description?: string },
): Promise<OrganizationSummary> {
  const slugBase = input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = `${slugBase || "org"}-${Date.now().toString(36)}`;

  const client = await supportDatabase.connect();
  try {
    await client.query("BEGIN");
    const org = await client.query<{ id: string; name: string; slug: string; kind: string; description: string | null; created_at: Date }>(
      `INSERT INTO workspace.organizations (name, slug, description, creator_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, slug, kind, description, created_at`,
      [input.name.trim(), slug, input.description?.trim() || null, accountId],
    );
    await client.query(
      `INSERT INTO workspace.organization_members (organization_id, account_id, role)
       VALUES ($1, $2, 'OWNER')`,
      [org.rows[0].id, accountId],
    );
    await client.query("COMMIT");

    return {
      id: org.rows[0].id,
      name: org.rows[0].name,
      slug: org.rows[0].slug,
      kind: org.rows[0].kind as "ORGANIZATION" | "PLATFORM",
      description: org.rows[0].description,
      role: "OWNER",
      memberCount: 1,
      createdAt: org.rows[0].created_at.toISOString(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listOrganizationsFor(accountId: string): Promise<OrganizationSummary[]> {
  const result = await supportDatabase.query<{
    id: string; name: string; slug: string; kind: string;
    description: string | null; role: OrgRole; member_count: string; created_at: Date;
  }>(
    `SELECT o.id, o.name, o.slug, o.kind, o.description, m.role, o.created_at,
            (SELECT COUNT(*) FROM workspace.organization_members AS c WHERE c.organization_id = o.id) AS member_count
     FROM workspace.organizations AS o
     JOIN workspace.organization_members AS m ON m.organization_id = o.id AND m.account_id = $1
     ORDER BY o.created_at ASC`,
    [accountId],
  );

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: row.kind as "ORGANIZATION" | "PLATFORM",
    description: row.description,
    role: row.role,
    memberCount: Number(row.member_count),
    createdAt: row.created_at.toISOString(),
  }));
}

export async function listOrganizationMembers(
  organizationId: string,
): Promise<{ accountId: string; role: OrgRole; joinedAt: string }[]> {
  const result = await supportDatabase.query<{ account_id: string; role: OrgRole; joined_at: Date }>(
    `SELECT account_id, role, joined_at
     FROM workspace.organization_members
     WHERE organization_id = $1
     ORDER BY joined_at ASC`,
    [organizationId],
  );

  return result.rows.map(row => ({
    accountId: row.account_id,
    role: row.role,
    joinedAt: row.joined_at.toISOString(),
  }));
}

async function requireOrgAdmin(organizationId: string, accountId: string): Promise<void> {
  const result = await supportDatabase.query<{ role: OrgRole }>(
    "SELECT role FROM workspace.organization_members WHERE organization_id = $1 AND account_id = $2",
    [organizationId, accountId],
  );
  const role = result.rows[0]?.role;
  if (!role) throw new Error("You are not a member of this organization.");
  if (role !== "OWNER" && role !== "ADMIN") {
    throw new Error("Only owners and admins can invite members.");
  }
}

/* ============================================================
   Invitations
   ============================================================ */

export async function inviteByEvantraId(
  organizationId: string,
  invitedBy: string,
  evantraId: string,
): Promise<OrganizationInvite> {
  await requireOrgAdmin(organizationId, invitedBy);

  const account = await supportDatabase.query<{ id: string }>(
    "SELECT id FROM identity.accounts WHERE evantra_id = $1 LIMIT 1",
    [evantraId],
  );
  if (!account.rows[0]) {
    throw new Error(`No Evantra account found for ID "${evantraId}".`);
  }
  if (account.rows[0].id === invitedBy) {
    throw new Error("You cannot invite yourself.");
  }

  const alreadyMember = await supportDatabase.query(
    "SELECT 1 FROM workspace.organization_members WHERE organization_id = $1 AND account_id = $2",
    [organizationId, account.rows[0].id],
  );
  if (alreadyMember.rowCount) {
    throw new Error("That account is already a member of this organization.");
  }

  const duplicate = await supportDatabase.query<{ id: string }>(
    `SELECT id FROM workspace.organization_invites
     WHERE organization_id = $1 AND evantra_id = $2 AND status = 'PENDING'`,
    [organizationId, evantraId],
  );
  if (duplicate.rows[0]) {
    throw new Error("An invitation is already pending for that Evantra ID.");
  }

  const org = await supportDatabase.query<{ name: string }>(
    "SELECT name FROM workspace.organizations WHERE id = $1",
    [organizationId],
  );

  const invite = await supportDatabase.query<{ id: string; created_at: Date }>(
    `INSERT INTO workspace.organization_invites
       (organization_id, invited_by, evantra_id, invited_account_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [organizationId, invitedBy, evantraId, account.rows[0].id],
  );

  await notify({
    accountId: account.rows[0].id,
    type: "organization.invite",
    title: `Invitation to join ${org.rows[0]?.name ?? "an organization"}`,
    body: "You have been invited to join an organization on Evantra Workspace.",
    link: "/workspace/organizations",
  });

  return {
    id: invite.rows[0].id,
    organizationId,
    organizationName: org.rows[0]?.name ?? "",
    evantraId,
    status: "PENDING",
    createdAt: invite.rows[0].created_at.toISOString(),
  };
}

export async function listPendingInvitesFor(accountId: string): Promise<OrganizationInvite[]> {
  const evantraIdRow = await supportDatabase.query<{ evantra_id: string }>(
    "SELECT evantra_id FROM identity.accounts WHERE id = $1",
    [accountId],
  );
  const evantraId = evantraIdRow.rows[0]?.evantra_id;
  if (!evantraId) return [];

  const result = await supportDatabase.query<{
    id: string; organization_id: string; organization_name: string;
    evantra_id: string; status: OrganizationInvite["status"]; created_at: Date;
  }>(
    `SELECT i.id, i.organization_id, o.name AS organization_name,
            i.evantra_id, i.status, i.created_at
     FROM workspace.organization_invites AS i
     JOIN workspace.organizations AS o ON o.id = i.organization_id
     WHERE i.evantra_id = $1 AND i.status = 'PENDING'
     ORDER BY i.created_at DESC`,
    [evantraId],
  );

  return result.rows.map(row => ({
    id: row.id,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    evantraId: row.evantra_id,
    status: row.status,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function respondToInvite(
  accountId: string,
  inviteId: string,
  accept: boolean,
): Promise<void> {
  const client = await supportDatabase.connect();
  try {
    await client.query("BEGIN");

    const invite = await client.query<{
      id: string; organization_id: string; evantra_id: string; status: string;
    }>(
      `SELECT id, organization_id, evantra_id, status
       FROM workspace.organization_invites
       WHERE id = $1
       FOR UPDATE`,
      [inviteId],
    );

    if (!invite.rows[0]) throw new Error("Invitation not found.");

    const account = await client.query<{ id: string }>(
      "SELECT id FROM identity.accounts WHERE evantra_id = $1",
      [invite.rows[0].evantra_id],
    );

    if (account.rows[0]?.id !== accountId) {
      throw new Error("This invitation is not addressed to your account.");
    }
    if (invite.rows[0].status !== "PENDING") {
      throw new Error("This invitation has already been handled.");
    }

    await client.query(
      `UPDATE workspace.organization_invites
       SET status = $1, responded_at = NOW()
       WHERE id = $2`,
      [accept ? "ACCEPTED" : "DECLINED", inviteId],
    );

    if (accept) {
      await client.query(
        `INSERT INTO workspace.organization_members (organization_id, account_id, role)
         VALUES ($1, $2, 'MEMBER')
         ON CONFLICT (organization_id, account_id) DO NOTHING`,
        [invite.rows[0].organization_id, accountId],
      );
      await notifyOrganization(invite.rows[0].organization_id, {
        type: "organization.member.joined",
        title: "A new member joined",
        link: "/workspace/organizations",
        exceptAccountId: accountId,
      });
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/* ============================================================
   Inbound emails (admin inbox)
   ============================================================ */

export interface InboundEmail {
  id: string;
  messageId: string | null;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  subject: string | null;
  bodyText: string | null;
  receivedAt: string;
  readAt: string | null;
}

export async function listInboundEmails(): Promise<InboundEmail[]> {
  const result = await supportDatabase.query<{
    id: string; message_id: string | null; from_email: string; from_name: string | null;
    to_email: string; subject: string | null; body_text: string | null;
    received_at: Date; read_at: Date | null;
  }>(
    `SELECT id, message_id, from_email, from_name, to_email, subject, body_text, received_at, read_at
     FROM workspace.inbound_emails
     ORDER BY received_at DESC
     LIMIT 200`,
  );

  return result.rows.map(row => ({
    id: row.id,
    messageId: row.message_id,
    fromEmail: row.from_email,
    fromName: row.from_name,
    toEmail: row.to_email,
    subject: row.subject,
    bodyText: row.body_text,
    receivedAt: row.received_at.toISOString(),
    readAt: row.read_at?.toISOString() ?? null,
  }));
}

export async function markInboundEmailRead(id: string): Promise<void> {
  await supportDatabase.query(
    "UPDATE workspace.inbound_emails SET read_at = NOW() WHERE id = $1 AND read_at IS NULL",
    [id],
  );
}

/* ============================================================
   Notifications
   ============================================================ */

export async function listNotifications(accountId: string): Promise<NotificationItem[]> {
  const result = await supportDatabase.query<{
    id: string; type: string; title: string; body: string | null;
    link: string | null; read_at: Date | null; created_at: Date;
  }>(
    `SELECT id, type, title, body, link, read_at, created_at
     FROM workspace.notifications
     WHERE account_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [accountId],
  );

  return result.rows.map(row => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link,
    readAt: row.read_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function markNotificationsRead(accountId: string, ids?: string[]): Promise<void> {
  if (ids && ids.length > 0) {
    await supportDatabase.query(
      `UPDATE workspace.notifications SET read_at = NOW()
       WHERE account_id = $1 AND id = ANY($2::uuid[])`,
      [accountId, ids],
    );
    return;
  }
  await supportDatabase.query(
    "UPDATE workspace.notifications SET read_at = NOW() WHERE account_id = $1 AND read_at IS NULL",
    [accountId],
  );
}

export async function countUnreadNotifications(accountId: string): Promise<number> {
  const result = await supportDatabase.query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM workspace.notifications WHERE account_id = $1 AND read_at IS NULL",
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

/* ============================================================
   Shared workspace resolution (same logic as repository.ts)
   ============================================================ */

async function workspaceIdFor(accountId: string): Promise<string> {
  const existing = await supportDatabase.query<{ id: string }>(
    `SELECT w.id
     FROM workspace.workspaces AS w
     LEFT JOIN workspace.members AS m
       ON m.workspace_id = w.id
      AND m.account_id = $1
     WHERE w.owner_id = $1 OR m.account_id IS NOT NULL
     ORDER BY (w.owner_id = $1) DESC, w.created_at ASC
     LIMIT 1`,
    [accountId],
  );

  if (existing.rows[0]) return existing.rows[0].id;

  const created = await supportDatabase.query<{ id: string }>(
    `INSERT INTO workspace.workspaces (owner_id, name, slug, type, tier)
     VALUES ($1, $2, $3, 'PERSONAL', 'CORE')
     ON CONFLICT (slug) DO NOTHING
     RETURNING id`,
    [accountId, "Personal Workspace", `personal-${accountId.slice(-32)}`],
  );

  if (created.rows[0]) return created.rows[0].id;

  const afterRace = await supportDatabase.query<{ id: string }>(
    "SELECT id FROM workspace.workspaces WHERE owner_id = $1 LIMIT 1",
    [accountId],
  );
  if (!afterRace.rows[0]) throw new Error("Unable to resolve the account workspace.");
  return afterRace.rows[0].id;
}
