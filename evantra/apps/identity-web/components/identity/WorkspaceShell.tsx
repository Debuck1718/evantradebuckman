"use client";

import { useEffect, useState, type ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogOut, Menu, ShieldCheck, Sparkles, X } from "lucide-react";

import { EvantraBrandIcon } from "../brand/EvantraBrandIcon";
import { useIdentitySession } from "./IdentitySessionProvider";
import { workspaceNavigation } from "../../app/workspace/lib/navigation";

/**
 * Workspace shell.
 *
 * Replaces the previous flat strip of
 * fifteen navigation tabs.
 *
 * Large screens get a persistent, grouped
 * sidebar so every destination stays one
 * click away without a wall of links.
 *
 * Small screens get a single trigger that
 * opens a full-height drawer, so navigation
 * never becomes a cramped horizontal
 * scroller.
 */
export function WorkspaceShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { account, session } = useIdentitySession();

  const [drawerOpen, setDrawerOpen] = useState(false);

  /*
   * Any navigation closes the drawer so the
   * destination is immediately visible on
   * small screens.
   */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /*
   * Lock background scrolling while the
   * drawer is open and restore it on close.
   */
  useEffect(() => {
    if (!drawerOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const initials =
    account
      ? `${account.firstName?.[0] ?? ""}${account.lastName?.[0] ?? ""}`.toUpperCase()
      : "EV";

  return (
    <div className="min-h-screen bg-[#06131f] text-white">
      {/* ==================================================
          Large screen sidebar
      ================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/[0.08] bg-[#071826]/80 backdrop-blur-2xl lg:flex">
        <WorkspaceSidebarContent
          pathname={pathname}
          account={account}
          initials={initials}
        />
      </aside>

      {/* ==================================================
          Small screen drawer
      ================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-[#03101a]/80 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[86vw] flex-col border-r border-white/10 bg-[#071826] shadow-2xl">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-[#e6b24a]/40 hover:text-[#e6b24a]"
              >
                <X size={17} />
              </button>
            </div>

            <WorkspaceSidebarContent
              pathname={pathname}
              account={account}
              initials={initials}
            />
          </aside>
        </div>
      )}

      {/* ==================================================
          Content column
      ================================================== */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#071826]/85 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setDrawerOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-[#e6b24a]/40 hover:text-[#e6b24a] lg:hidden"
              >
                <Menu size={18} />
              </button>

              <Link
                href="/workspace/hub"
                className="flex items-center gap-3 lg:hidden"
              >
                <EvantraBrandIcon size={30} />
              </Link>

              <div className="hidden min-w-0 lg:block">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                  Evantra Workspace
                </p>
                <p className="truncate text-sm font-semibold text-white">
                  {account
                    ? `Welcome back, ${account.firstName}`
                    : "Operating System"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {session && (
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300 sm:inline-flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Session active
                </span>
              )}

              <Link
                href="/security"
                className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:text-white sm:inline-flex"
              >
                Security
              </Link>

              <Link
                href="/logout"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-3 py-2 text-xs font-semibold text-[#e6b24a] transition hover:bg-[#e6b24a] hover:text-[#06131f]"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign out</span>
              </Link>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

/**
 * Shared sidebar body used by both the
 * persistent sidebar and the mobile drawer.
 */
function WorkspaceSidebarContent({
  pathname,
  account,
  initials,
}: {
  pathname: string | null;
  account: { firstName?: string; lastName?: string; evantraId?: string } | null;
  initials: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <EvantraBrandIcon size={38} />

        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.18em] text-white">
            EVANTRA
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#e6b24a]">
            Workspace OS
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {workspaceNavigation.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                        ? "border border-[#e6b24a]/30 bg-[#e6b24a]/10 text-white"
                        : "border border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                      }`}
                  >
                    <Icon
                      size={17}
                      className={
                        active
                          ? "text-[#e6b24a]"
                          : "text-white/40 group-hover:text-[#e6b24a]"
                      }
                    />

                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Identity footer */}
      <div className="border-t border-white/[0.08] p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 text-xs font-semibold text-[#fae59a]">
            {initials}
          </span>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              {account
                ? `${account.firstName ?? ""} ${account.lastName ?? ""}`.trim()
                : "Evantra ID"}
            </p>

            <p className="flex items-center gap-1 truncate text-[10px] text-white/40">
              <ShieldCheck size={11} className="text-[#e6b24a]" />
              {account?.evantraId ?? "not signed in"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 px-1 text-[10px] text-white/30">
          <Sparkles size={11} className="text-[#e6b24a]/70" />
          <span>Protected by Evantra Identity</span>
        </div>
      </div>
    </>
  );
}