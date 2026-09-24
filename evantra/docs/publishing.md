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
2fa enabled is required`. Pick one:

- **One-time password.** Pass a current code from your authenticator:

  ```powershell
  .\evantra\scripts\publish-sdk.ps1 -Otp 123456
  ```

  Codes are short-lived; run the script again with a fresh code if one
  expires between the two packages.

- **Granular access token.** Create a token scoped to `@evantra` with
  **Bypass 2FA** enabled (npmjs.com -> Access Tokens -> Generate New
  Token -> Granular). Store it so the script picks it up:

  ```powershell
  npm config set //registry.npmjs.org/:_authToken=<token>
  ```

  This is the better choice for CI and for repeat publishing.

### Provenance

Provenance lets consumers verify which commit and CI run produced each
tarball. It is **not** enabled in `publishConfig`, because npm hard-fails
with `EUSAGE: Automatic provenance generation not supported for provider:
null` when you publish manually from a laptop - it does not skip quietly.

Instead, opt in only where it works: pass `--provenance` from a CI
publish job running on a supported provider with OIDC, e.g. GitHub
Actions:

```yaml
- run: npm publish --provenance --access public
```

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
