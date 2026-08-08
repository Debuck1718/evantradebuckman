"use client";

import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

export default function IdentityHomePage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [evantraId, setEvantraId] =
    useState("");

  const [password, setPassword] =
    useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    // Authentication API connection
    // will be connected after the
    // Identity UI foundation is complete.
  }

  return (
    <main className="identity-page">
      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div
        className="identity-background"
        aria-hidden="true"
      >
        <div className="identity-grid" />

        <div
          className="identity-orb identity-orb-one"
        />

        <div
          className="identity-orb identity-orb-two"
        />
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="identity-header">
        <Link
          href="/"
          className="identity-brand"
          aria-label="Evantra Identity"
        >
          <span className="identity-brand-mark">
            <ShieldCheck size={21} />
          </span>

          <span className="identity-brand-name">
            EVANTRA
          </span>
        </Link>

        <span className="identity-header-label">
          Identity Infrastructure
        </span>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <section className="identity-main">
        {/* =================================================
            INTRODUCTION
        ================================================= */}

        <div className="identity-intro">
          <div className="identity-eyebrow">
            <span className="identity-eyebrow-dot" />

            Secure Identity
          </div>

          <h1 className="identity-title">
            One identity.
            <span className="identity-title-gradient">
              Every Evantra experience.
            </span>
          </h1>

          <p className="identity-description">
            Your Evantra ID provides secure access
            across the Evantra digital ecosystem —
            from technology platforms to services,
            applications, and future products.
          </p>

          <div className="identity-trust-row">
            <div className="identity-trust-item">
              <LockKeyhole
                className="identity-trust-icon"
                size={15}
              />

              Secure access
            </div>

            <div className="identity-trust-item">
              <Fingerprint
                className="identity-trust-icon"
                size={15}
              />

              Identity-first
            </div>

            <div className="identity-trust-item">
              <ShieldCheck
                className="identity-trust-icon"
                size={15}
              />

              Protected infrastructure
            </div>
          </div>
        </div>

        {/* =================================================
            LOGIN
        ================================================= */}

        <section
          className="identity-panel"
          aria-labelledby="login-title"
        >
          <div className="identity-panel-header">
            <p className="identity-panel-kicker">
              Evantra Identity
            </p>

            <h2
              id="login-title"
              className="identity-panel-title"
            >
              Welcome back.
            </h2>

            <p className="identity-panel-description">
              Secure access to the Evantra digital
              ecosystem.
            </p>
          </div>

          <form
            className="identity-form"
            onSubmit={handleSubmit}
          >
            {/* Evantra ID */}

            <div className="identity-field">
              <div className="identity-label-row">
                <label
                  htmlFor="evantra-id"
                  className="identity-label"
                >
                  Evantra ID
                </label>
              </div>

              <div className="identity-input-wrapper">
                <UserRound
                  className="identity-input-icon"
                  size={17}
                />

                <input
                  id="evantra-id"
                  name="evantraId"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your Evantra ID"
                  value={evantraId}
                  onChange={(event) =>
                    setEvantraId(
                      event.target.value,
                    )
                  }
                  className="identity-input"
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div className="identity-field">
              <div className="identity-label-row">
                <label
                  htmlFor="password"
                  className="identity-label"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="identity-forgot"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="identity-input-wrapper">
                <LockKeyhole
                  className="identity-input-icon"
                  size={17}
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  className="identity-input"
                  style={{
                    paddingRight: "55px",
                  }}
                  required
                />

                <button
                  type="button"
                  className="identity-password-button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="identity-submit"
            >
              Sign in securely

              <ArrowRight size={17} />
            </button>
          </form>

          <div className="identity-divider">
            <span>New to Evantra?</span>
          </div>

          <p className="identity-create">
            Don&apos;t have an Evantra ID?{" "}
            <Link href="/register">
              Create one
            </Link>
          </p>

          <div className="identity-security-note">
            <ShieldCheck size={14} />

            Protected by Evantra Identity
          </div>
        </section>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="identity-footer">
        <span className="identity-footer-brand">
          Evantra Identity
        </span>

        <span>
          Secure identity infrastructure for
          the Evantra ecosystem.
        </span>

        <span>
          © {new Date().getFullYear()} Evantra
        </span>
      </footer>
    </main>
  );
}