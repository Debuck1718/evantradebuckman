# Distributing the Evantra Identity SDK

How to get `@evantra-identity/sdk` and `@evantra-identity/react` into a
developer's project.

Both packages are **published on the npm registry**. Use the registry
channel unless you have a specific reason not to (air-gapped CI, or an
offline install).

---

## Option 1 — npm registry (recommended)

```bash
npm install @evantra-identity/sdk
npm install @evantra-identity/react
```

pnpm, Yarn and Bun accept the same names:

```bash
pnpm add @evantra-identity/sdk @evantra-identity/react
yarn add @evantra-identity/sdk @evantra-identity/react
bun add @evantra-identity/sdk @evantra-identity/react
```

Nothing else is required. The published tarballs already contain compiled
`dist/` output, type declarations, `README.md` and `LICENSE`, so no build
step runs on install and no lifecycle script is needed.

### Provenance

Releases are published from CI via npm trusted publishing (OIDC), so each
version carries a signed provenance attestation recording the repository
and workflow run that produced it. Browse it on the package page under
**Provenance**, or:

```bash
npm view @evantra-identity/sdk dist.tarball
```

### Current versions

```bash
npm view @evantra-identity/sdk version
npm view @evantra-identity/react version
```

### React Native / Expo

`@evantra-identity/react` declares `react >=18` as a peer dependency. Make
sure your app satisfies it; npm 7+ installs peers automatically.

---

## Option 2 — Tarballs (offline / pinned installs)

Use this only when the registry is not reachable. Prebuilt `.tgz` files
live in `evantra/dist-artifacts/`:

Prebuilt `.tgz` files live in `evantra/dist-artifacts/`:

```
evantra-identity-sdk-0.1.1.tgz
evantra-identity-react-0.1.1.tgz
```

They contain the compiled `dist/` plus `README.md`, `LICENSE` and
`package.json`. No build step is required, so they work in every package
manager and every CI.

> **One caveat, confirmed by testing.** Because both packages declare a
> `prepare` script, `npm install <tarball>` may print
> `npm warn allow-scripts ... (prepare: npm run build)`. The warning is
> harmless for a tarball — the `dist/` is already inside it — but it does
> mean the install is not entirely script-free. pnpm and Yarn behave the
> same way. If your CI fails on script warnings, install with
> `npm install --ignore-scripts <tarball>`.

### Install from a local path

```bash
npm install ./evantra/dist-artifacts/evantra-identity-sdk-0.1.1.tgz
npm install ./evantra/dist-artifacts/evantra-identity-react-0.1.1.tgz
```

pnpm, Yarn and Bun accept the same path.

### Install from a URL

Host the `.tgz` files anywhere reachable (GitHub Release asset, S3, a
static site) and install by URL:

```bash
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.1/evantra-identity-sdk-0.1.1.tgz
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.1/evantra-identity-react-0.1.1.tgz
```

### Point a package name at a tarball

To keep `import ... from "@evantra-identity/sdk"` working unchanged, use an
alias in `package.json`:

```json
{
  "dependencies": {
        "@evantra-identity/sdk": "https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.1/evantra-identity-sdk-0.1.1.tgz",
        "@evantra-identity/react": "https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.1/evantra-identity-react-0.1.1.tgz"
      }
    }
    ```

    Then `npm install` and use the normal import paths. Switching to the
    registry later is a one-line change per dependency.

    ### Regenerating the artifacts

    ```bash
    cd evantra
    powershell -File scripts/build-artifacts.ps1
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

| Channel                      | Needs npm login | Needs build | Stable URL | Recommended  |
| ---------------------------- | --------------- | ----------- | ---------- | ------------ |
| **npm registry**             | No              | No          | Yes        | **Yes**      |
| Tarball from a URL / Release | No              | No          | Yes        | Offline only |
| Tarball from a local path    | No              | No          | No         | Offline only |
| Git URL                      | No              | Yes         | Yes        | Rarely       |

The registry channel is the only one that gives consumers dependency
resolution, semver ranges and provenance. The others exist for
environments that cannot reach npm.

---

## What consumers can rely on

- **Package names.** `@evantra-identity/sdk` (servers, desktop apps, CLIs)
  and `@evantra-identity/react` (React, Next.js, React Native, Expo).
- **ESM with types.** `dist/index.js` plus `dist/index.d.ts`. Node 18+.
- **No runtime dependencies.** `@evantra-identity/sdk` has none at all;
  `@evantra-identity/react` only needs `react >=18` as a peer.
- **License.** MIT.
- **Provenance.** Published from CI via trusted publishing (OIDC).

See the [Client Integration Guide](./identity-client-integration.md) for
the actual usage.