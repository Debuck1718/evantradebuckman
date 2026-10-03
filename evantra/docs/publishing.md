# Publishing the Evantra Identity SDK

How maintainers release the public packages to npm.

Two packages are public:

| Package                   | Directory                 | Kind                |
| ------------------------- | ------------------------- | ------------------- |
| `@evantra-identity/sdk`            | `packages/sdk`            | Server / native SDK |
| `@evantra-identity/react` | `packages/identity-react` | React / RN client   |

Everything else in the workspace is `"private": true` and never
published.

---

## Quick path: one command after login

Everything up to and including the build is already done in the repo.
Once you are authenticated, a single script rebuilds, verifies and
publishes both packages:

```powershell
npm login
npm whoami
.\evantra\scripts\publish-sdk.ps1 -DryRun   # build + show tarball contents, no upload
.\evantra\scripts\publish-sdk.ps1           # real publish
```

The rest of this document explains each step the script performs, for
times you want to do them by hand or in CI.

---

## 1. One-time npm setup

The `@evantra` scope must exist on npm and be owned by the publishing
account. Then publish the first release from an authenticated machine:

```bash
npm login
npm whoami        # confirm the expected account
```

Both packages set `publishConfig.access: "public"`, so scoped public
packages publish correctly without `--access public`.

### Two-factor authentication

If your npm account has 2FA enabled, publishing returns
`403 ... Two-factor authentication or granular access token with bypass
2fa enabled is required`.

> **Do not use a bypass-2FA granular token.** npm is retiring them. As of
> 31 July 2026 they can no longer change package access or manage tokens,
> and their ability to publish directly is removed in **January 2027**
> ([npm changelog](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens/)).
> The old advice in this document recommended them; that was wrong.

Use one of the two supported paths instead:

- **CI / automated releases: trusted publishing (OIDC).** No token at all.
  GitHub mints a short-lived OIDC token that npm verifies against the
  trusted publisher configured on the package. This is the path this repo
  now uses - see *Publishing from CI* below.

- **Local / manual releases: staged publishing.** Stage the upload, then
  approve it with an interactive 2FA prompt:

  ```bash
  npm stage publish          # uploads, does not go live
  npm stage approve <id>     # approve with your authenticator code
  ```

  This is what a bypass-2FA token degrades to anyway, so it is worth
  adopting now rather than at the January 2027 cutoff.

- **One-time password (still valid today).** Pass a current code from your
  authenticator to the local script:

  ```powershell
  .\evantra\scripts\publish-sdk.ps1 -Otp 123456
  ```

  Codes are short-lived; re-run with a fresh code if one expires between
  the two packages.

### Recommended package setting

On each package's npm settings page, choose:

> **Require two-factor authentication and disallow bypass 2fa tokens
> (recommended)**

All publishing-access options remain compatible with OIDC trusted
publishers, so the strictest option costs nothing once trusted publishing
is configured. Note this setting invalidates any bypass-2FA token still in
use, so configure trusted publishing **first**.

### Publishing from CI (trusted publishing)

The workflow lives at `.github/workflows/publish-identity.yml` and releases
on a tag push:

```bash
cd evantra/packages/sdk && pnpm version patch
cd ../identity-react && pnpm version patch
git commit -am "release: identity v0.1.1"
git tag identity-v0.1.1
git push origin main --follow-tags
```

The tag only decides *when*; the version that gets published is whatever
is in each `package.json`. One-time setup, per package (both need it -
configuring one does not cover the other):

npmjs.com -> the package -> Settings -> Trusted Publisher -> GitHub Actions

| Field              | Value                 |
| ------------------ | --------------------- |
| Organization/user  | `Debuck1718`          |
| Repository         | `evantradebuckman`    |
| Workflow filename  | `publish-identity.yml`|
| Environment        | *(leave blank)*       |

The `prepublishOnly` hook was removed from both packages. `prepare`
already runs on publish, so keeping both compiled each package twice for
no benefit.

### Provenance

Provenance lets consumers verify which commit and CI run produced each
tarball. It is **not** enabled in `publishConfig`, because npm hard-fails
with `EUSAGE: Automatic provenance generation not supported for provider:
null` when you publish manually from a laptop - it does not skip quietly.

Instead, opt in only where it works: pass `--provenance` from a CI
publish job running on a supported provider with OIDC. The workflow in
this repo already does:

```yaml
permissions:
  id-token: write   # required for the OIDC exchange
# ...
- run: npm publish --provenance
```

No `--access public` flag is needed; `publishConfig.access` already sets
it.

Local publishes omit the flag and succeed without provenance.

---

## 2. Pre-flight checks

From the `evantra/` directory:

```bash
pnpm install
pnpm --filter @evantra-identity/sdk build
pnpm --filter @evantra-identity/react build
pnpm typecheck
```

If `pnpm` is not available on the machine, the build and pack steps work
with plain `npm` from each package directory (the packages have no
runtime dependencies of their own):

```bash
cd packages/sdk
npm run build
npm pack --dry-run

cd ../identity-react
npm run build
npm pack --dry-run
```

Confirm the published tarball contains only what it should. `files`
limits each package to `dist`, `README.md` and `LICENSE`:

```bash
pnpm --filter @evantra-identity/sdk pack --dry-run
pnpm --filter @evantra-identity/react pack --dry-run
```

Expected contents (7 files each):

```
LICENSE
README.md
dist/index.d.ts
dist/index.js
dist/oauth.d.ts
dist/oauth.js
package.json
```

You should **not** see `src`, `tsconfig.json`, or any app code in the
listing.

---

## 3. Versioning

The packages version independently. Bump with `pnpm version`, which
creates the git commit and tag:

```bash
# from the package directory
cd packages/sdk
pnpm version patch    # or minor / major
cd ../identity-react
pnpm version patch
```

| Change                        | Bump    |
| ----------------------------- | ------- |
| Docs, typo, internal refactor | `patch` |
| New export, new option        | `minor` |
| Breaking API / signature      | `major` |

While the version is `0.x`, treat `minor` as potentially breaking and
call it out in the release notes.

---

## 4. Publish

`prepublishOnly` runs the build automatically, so a stale `dist` can
never ship:

```bash
pnpm --filter @evantra-identity/sdk publish
pnpm --filter @evantra-identity/react publish
```

For a dry run first:

```bash
pnpm --filter @evantra-identity/sdk publish --dry-run
```

---

## 5. Verify

```bash
npm view @evantra-identity/sdk version
npm view @evantra-identity/react version
```

Install into a scratch project and exercise the flow:

```bash
mkdir evantra-smoke && cd evantra-smoke
pnpm init
pnpm add @evantra-identity/sdk @evantra-identity/react
node -e "import('@evantra-identity/sdk').then(m => m.createEvantraPkcePair().then(p => console.log(p.challenge.length > 0)))"
```

---

## 6. After release

- Push the version commits and tags: `git push --follow-tags`.
- Add an entry to the release notes / changelog describing the change.
- If the public API changed, update
  [`identity-client-integration.md`](./identity-client-integration.md)
  and the package READMEs in the same PR.

---

## Checklist

- [ ] `pnpm typecheck` and both package builds pass.
- [ ] `pack --dry-run` shows only `dist`, `README.md`, `LICENSE`.
- [ ] Version bumped with the correct semver level.
- [ ] `repository.directory` in `package.json` points at the right folder.
- [ ] Published from the `@evantra` scope owner account.
- [ ] Verified with `npm view` and a scratch install.
- [ ] The script exited `0`. It now fails the run when a package is not
      confirmed on the registry, so a non-zero exit means the release did
      not land - check the output rather than assuming success.

> **Version must be new.** npm rejects a re-publish of an existing
> version with `403 You cannot publish over the previously published
> versions`. Bump the version before tagging.
