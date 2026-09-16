"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Building2,
  Check,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";

interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  kind: "ORGANIZATION" | "PLATFORM";
  description: string | null;
  role: string;
  memberCount: number;
  createdAt: string;
}

interface OrganizationInvite {
  id: string;
  organizationName: string;
  evantraId: string;
  createdAt: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [inviteOrgId, setInviteOrgId] = useState("");
  const [inviteEvantraId, setInviteEvantraId] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [orgsResponse, invitesResponse] = await Promise.all([
        fetch("/api/workspace/organizations", { cache: "no-store" }),
        fetch("/api/workspace/invites", { cache: "no-store" }),
      ]);

      if (orgsResponse.ok) {
        const payload = await orgsResponse.json();
        setOrganizations(payload.organizations ?? []);
      }
      if (invitesResponse.ok) {
        const payload = await invitesResponse.json();
        setInvites(payload.invites ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/workspace/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to create the organization.");
      }

      setShowCreate(false);
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the organization.");
    } finally {
      setBusy(false);
    }
  }

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/workspace/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: inviteOrgId,
          evantraId: inviteEvantraId,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to send the invitation.");
      }

      setInviteEvantraId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the invitation.");
    } finally {
      setBusy(false);
    }
  }

  async function respond(inviteId: string, accept: boolean) {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/workspace/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, accept }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to respond to the invitation.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to respond to the invitation.");
    } finally {
      setBusy(false);
    }
  }

  const manageableOrgs = organizations.filter(
    (org) => org.role === "OWNER" || org.role === "ADMIN",
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10 flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-[#e6b24a]/20 bg-[#e6b24a]/10">
            <Building2 size={22} className="text-[#e6b24a]" />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Evantra Workspace
          </p>
          <h1 className="text-3xl font-semibold">Organizations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Create an organization for your business, invite your team by Evantra ID,
            and collaborate in a shared space. The Evantra Team organization runs the
            platform itself.
          </p>
        </div>

        <button
          onClick={() => setShowCreate((open) => !open)}
          className="rounded-xl bg-[#e6b24a] px-5 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
        >
          {showCreate ? "Cancel" : "New organization"}
        </button>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Pending invitations */}
      {invites.length > 0 && (
        <section className="mb-10 rounded-2xl border-[#e6b24a]/25 bg-[#e6b24a]/[0.06] p-6">
          <h2 className="text-lg font-semibold">Pending invitations</h2>
          <ul className="mt-4 space-y-3">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{invite.organizationName}</p>
                  <p className="text-xs text-white/40">
                    Invited by Evantra ID · {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respond(invite.id, true)}
                    disabled={busy}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => respond(invite.id, false)}
                    disabled={busy}
                    className="flex items-center gap-1.5 rounded-lg border-white/15 px-3.5 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 disabled:opacity-50"
                  >
                    <X size={14} /> Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Create form */}
      {showCreate && (
        <section className="mb-10 rounded-2xl border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-lg font-semibold">Create an organization</h2>
          <form onSubmit={handleCreate} className="mt-6 max-w-xl space-y-5">
            <div>
              <label htmlFor="orgName" className="mb-2 block text-sm font-medium text-white/80">
                Name
              </label>
              <input
                id="orgName"
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Acme Studios"
                className="w-full rounded-xl border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
              />
            </div>
            <div>
              <label htmlFor="orgDescription" className="mb-2 block text-sm font-medium text-white/80">
                Description <span className="text-white/30">(optional)</span>
              </label>
              <textarea
                id="orgDescription"
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What does this organization do?"
                className="w-full rounded-xl border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e] disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : "Create organization"}
            </button>
          </form>
        </section>
      )}

      {/* Organization list */}
      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : organizations.length === 0 ? (
        <div className="rounded-2xl border-white/10 bg-white/[0.03] p-10 text-center">
          <Building2 size={32} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/40">
            You haven't joined any organization yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <section
              key={org.id}
              className={`rounded-2xl border p-6 ${
                org.kind === "PLATFORM"
                  ? "border-[#e6b24a]/30 bg-[#e6b24a]/[0.05]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                <span className="rounded-full border-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  {org.role}
                </span>
              </div>
              {org.kind === "PLATFORM" && (
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e6b24a]">
                  Platform operators
                </p>
              )}
              {org.description && (
                <p className="mt-3 text-sm leading-6 text-white/50">{org.description}</p>
              )}
              <p className="mt-4 text-xs text-white/30">
                {org.memberCount} member{org.memberCount === 1 ? "" : "s"}
              </p>

              {(org.role === "OWNER" || org.role === "ADMIN") && (
                <button
                  onClick={() => {
                    setInviteOrgId(org.id);
                    setInviteEvantraId("");
                  }}
                  className="mt-4 flex items-center gap-1.5 rounded-lg border-white/15 px-3.5 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <UserPlus size={14} /> Invite member
                </button>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Invite modal-ish inline form */}
      {inviteOrgId && (
        <section className="mt-10 rounded-2xl border-[#e6b24a]/25 bg-[#e6b24a]/[0.05] p-8">
          <h2 className="text-lg font-semibold">
            Invite to{" "}
            {organizations.find((org) => org.id === inviteOrgId)?.name ?? "organization"}
          </h2>
          <form onSubmit={handleInvite} className="mt-6 flex max-w-xl flex-col gap-4 sm:flex-row">
            <input
              required
              value={inviteEvantraId}
              onChange={(event) => setInviteEvantraId(event.target.value)}
              placeholder="Evantra ID (e.g. evan.debuckman)"
              className="flex-1 rounded-xl border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
            />
            <button
              type="submit"
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e] disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Send invite
            </button>
          </form>
        </section>
      )}

      {manageableOrgs.length === 0 && !loading && (
        <p className="mt-8 text-xs text-white/30">
          Tip: owners and admins of an organization can invite members by Evantra ID.
        </p>
      )}
    </main>
  );
}
