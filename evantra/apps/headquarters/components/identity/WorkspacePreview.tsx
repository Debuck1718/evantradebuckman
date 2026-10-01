import Link from "next/link";

/**
 * Mobile workspace account preview.
 *
 * Renders a phone-sized mock of the Evantra Workspace OS account screen so the
 * identity page can show what the workspace experience actually looks like.
 * Purely presentational — no data or state.
 */
export default function WorkspacePreview({
  workspaceWebUrl,
}: {
  workspaceWebUrl: string;
}) {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(230,178,74,.10),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(11,79,113,.20),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[.9fr_1.1fr]">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-ev-gold/25 bg-ev-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-ev-gold">
            Workspace Preview
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your account, in the palm of your hand.
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/72">
            The Workspace OS account screen is the personal command center for
            the Evantra ecosystem. It carries your identity, your life-and-work
            plan, and the intelligence that keeps both accountable.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Zero-knowledge security backed by the Evantra Kernel.",
              "Capture promises and commitments in a single action.",
              "Run a burden scan to see where your workload stands.",
              "Live telemetry that measures the plan you actually live.",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-white/70"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ev-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${workspaceWebUrl}/workspace/account`}
              className="btn-glow"
            >
              Open workspace account
            </Link>
            <Link href={`${workspaceWebUrl}`} className="btn-outline">
              Explore Workspace OS
            </Link>
          </div>
        </div>

        {/* Phone mock */}
        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-[440px]">
          {/* Ambient glow behind the device */}
          <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(230,178,74,.14),transparent_65%)] blur-2xl" />

          <div className="relative rounded-[3rem] border border-white/12 bg-[#0a1826] p-3 shadow-[0_40px_120px_rgba(0,0,0,.55)]">
            <div className="overflow-hidden rounded-[2.4rem] border border-white/8 bg-[#06131F]">
              {/* Status / top bar */}
              <div className="flex items-center justify-between px-5 pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <span className="text-white/80" aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 6h16M4 12h16M4 18h16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ev-gold/30 bg-ev-gold/10">
                  <span className="text-sm font-bold text-ev-gold">E</span>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-white/70" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 6l-6 6 6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Hero card */}
              <div className="mx-5 mt-6 rounded-[1.75rem] border border-ev-gold/25 bg-[#081521] p-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-ev-gold/30 bg-ev-gold/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ev-gold">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3l2.4 5.2L20 9.4l-4 4 .9 5.6L12 16.6 7.1 19l.9-5.6-4-4 5.6-1.2z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Evantra Workspace OS
                </span>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Kernel 1.0 Active
                </span>

                <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white">
                  Command center for{" "}
                  <span className="text-ev-gold">Evans Buckman</span>
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/65">
                  Your native operating system for life, work, and identity.
                  Backed by the Evantra Kernel with zero-knowledge security,
                  cognitive burden defense, and promise accountability.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#e6b24a] px-4 py-3.5 text-sm font-semibold text-[#06131f]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Capture Promise
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-white/90">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 3l7 4v5c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.2 12.2l2 2 3.6-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Run Burden Scan
                  </div>
                </div>
              </div>

              {/* Live intelligence */}
              <div className="mx-5 mt-6">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ev-gold">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 7l8-4 8 4-8 4z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 12l8 4 8-4M4 17l8 4 8-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Live Intelligence Telemetry
                </p>

                <p className="mt-3 text-sm font-semibold text-ev-gold">
                  View Full Life-Work Plan →
                </p>
              </div>

              {/* Burden index card */}
              <div className="mx-5 mb-6 mt-5 rounded-[1.75rem] border border-white/10 bg-[#081521] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Burden Index
                  </p>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Optimal &amp; Sustainable
                  </span>
                </div>

                <p className="mt-4 text-4xl font-bold text-white">
                  28{" "}
                  <span className="text-base font-medium text-white/40">
                    / 100 max
                  </span>
                </p>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
                </div>

                <p className="mt-5 text-xs leading-5 text-white/55">
                  Calculated from active tasks, meeting saturation, and upcoming
                  commitments.
                </p>

                <p className="mt-4 text-xs font-semibold text-ev-gold">
                  Adjust workload inputs →
                </p>
              </div>

              {/* Next card teaser */}
              <div className="mx-5 mb-6 rounded-[1.75rem] border border-white/10 bg-[#081521] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Promise Graph
                  </p>
                  <span className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
                    Syncing
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="h-2.5 w-full rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-4/5 rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-2/3 rounded-full bg-white/[0.07]" />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs uppercase tracking-[0.22em] text-white/40">
            Workspace OS · Account
          </p>
        </div>
      </div>
    </section>
  );
}
