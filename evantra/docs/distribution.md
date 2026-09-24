# Distributing the Evantra Identity SDK

How to get `@evantra-identity/sdk` and `@evantra-identity/react` into a
developer's project **without npm publishing**.

npm publishing is blocked until npm's two-factor authentication flow is
completed, so until then use one of the channels below. All three ship the
exact same code.

---

## Option 1 — Tarballs (verified, works today)

Prebuilt `.tgz` files live in `evantra/dist-artifacts/`:

```
evantra-identity-sdk-0.1.0.tgz
evantra-identity-react-0.1.0.tgz
```

They contain the compiled `dist/` plus `README.md` and `LICENSE`. No build
step and no install scripts are required, so they work in every package
manager and every CI.

### Install from a local path

```bash
npm install ./evantra/dist-artifacts/evantra-identity-sdk-0.1.0.tgz
npm install ./evantra/dist-artifacts/evantra-identity-react-0.1.0.tgz
```

pnpm, Yarn and Bun accept the same path.

### Install from a URL

Host the `.tgz` files anywhere reachable (GitHub Release asset, S3, a
static site) and install by URL:

```bash
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-sdk-0.1.0.tgz
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-react-0.1.0.tgz
```

### Point a package name at a tarball

To keep `import ... from "@evantra-identity/sdk"` working unchanged, use an
alias in `package.json`:

```json
{
  "dependencies": {
    "@evantra-identity/sdk": "https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-sdk-0.1.0.tgz",
    "@evantra-identity/react": "https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-react-0.1.0.tgz"
  }
}
```

Then `npm install` and use the normal import paths. Migrating to the real
npm release later is a one-line change per dependency.

---

## Option 2 — GitHub Release (recommended publishing channel)

Attach the two `.tgz` files from `evantra/dist-artifacts/` to a GitHub
Release. This gives you a stable, versioned, citable URL and is the usual
way to ship before a registry release.

1. In `evantra/`, rebuild the artifacts:

   ```bash
   # from evantra/packages/sdk
   npm run build
   npm pack --pack-destination ../../dist-artifacts

   # from evantra/packages/identity-react
   npm run build
   npm pack --pack-destination ../../dist-artifacts
   ```

2. On GitHub: **Releases → Draft a new release**

   - Tag: `identity-v0.1.0`
   - Title: `Evantra Identity SDK v0.1.0`
   - Attach both `.tgz` files
   - Paste the "What's in this release" notes below

3. Share the release link. Consumers follow Option 1.

### Suggested release notes

```markdown
## Evantra Identity SDK v0.1.0

Sign in with Evantra — OAuth 2.0 Authorization Code flow with PKCE
(RFC6749, RFC7636, RFC8252).

### Packages

- `@evantra-identity/sdk` — servers, desktop apps, CLIs
- `@evantra-identity/react` — React, Next.js, React Native, Expo

### Install

```bash
npm install <release-asset-url>/evantra-identity-sdk-0.1.0.tgz
npm install <release-asset-url>/evantra-identity-react-0.1.0.tgz
```

### Docs

- [Client Integration Guide](../blob/main/evantra/docs/identity-client-integration.md)
```

---

## Option 3 — Git URL

`dist/` is not committed, so a git install must build the package after
cloning. Both packages declare a `prepare` script for exactly that.

```bash
npm install github:Debuck1718/evantradebuckman#main
```

> **Caveat, confirmed by testing.** npm 11.18 does not run lifecycle
> scripts from untrusted sources by default. The install logs
> `npm warn allow-scripts ... (prepare: npm run build)` and, if the build
> is skipped, the package will have no `dist/` and will fail to import.
>
> If you use this method, either approve the script
> (`npm install-scripts approve @evantra-identity/sdk`) or commit the
> built `dist/` to the repository. **Prefer Option 1 or 2** — the tarballs
> need no scripts at all.

---

## Which should you use?

| Channel                       | Needs npm login | Needs build | Stable URL | Recommended |
| ----------------------------- | --------------- | ----------- | ---------- | ----------- |
| Tarball from a local path     | No              | No          | No         | For handoffs |
| Tarball from a URL / Release  | No              | No          | Yes        | **Yes**     |
| Git URL                       | No              | Yes         | Yes        | Only if you commit `dist/` |
| npm registry                  | Yes (2FA)       | No          | Yes        | Once unblocked |

---

## Migrating to npm later

When the npm publish succeeds, nothing in consumer code changes. Replace
the tarball or git reference with the registry version:

```bash
npm uninstall @evantra-identity/sdk @evantra-identity/react
npm install @evantra-identity/sdk @evantra-identity/react
```

Import statements stay identical because the package names are unchanged.

---

## What consumers can rely on

- **Same code, same names.** Every channel ships `@evantra-identity/sdk`
  and `@evantra-identity/react` at version `0.1.0`.
- **ESM with types.** `dist/index.js` plus `dist/index.d.ts`. Node 18+.
- **No runtime dependencies.** `@evantra-identity/sdk` has none at all;
  `@evantra-identity/react` only needs `react >=18` as a peer.
- **License.** MIT, included in each tarball.

See the [Client Integration Guide](./identity-client-integration.md) for
the actual usage.