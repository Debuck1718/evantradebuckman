# Evantra

Monorepo for the Evantra platform and the **public Evantra Identity SDK**.

## Public packages

These packages are published to npm and licensed under MIT. Anyone can
install them to add **Sign in with Evantra** to their own application.

| Package                                                | Install                            | For                                  |
| ------------------------------------------------------ | ---------------------------------- | ------------------------------------ |
| [`@evantra-identity/react`](./packages/identity-react) | `pnpm add @evantra-identity/react` | React, Next.js, React Native, Expo   |
| [`@evantra-identity/sdk`](./packages/sdk)              | `pnpm add @evantra-identity/sdk`   | Servers, desktop apps, CLI, backends |

> **Not on the npm registry yet.** Until the registry release lands, install
> from the prebuilt tarballs in [`dist-artifacts/`](./dist-artifacts):
>
> ```bash
> npm install ./evantra/dist-artifacts/evantra-identity-sdk-0.1.0.tgz
> npm install ./evantra/dist-artifacts/evantra-identity-react-0.1.0.tgz
> ```
>
> See the [Distribution Guide](./docs/distribution.md) for tarball, GitHub
> Release and git-URL instructions.

Both implement **OAuth 2.0 Authorization Code flow with PKCE**
(RFC6749, RFC7636, RFC8252). There is no implicit flow and no
client-secret-only flow.

- Full walkthrough: [Client Integration Guide](./docs/identity-client-integration.md)
- Releasing: [Publishing Guide](./docs/publishing.md)
- Without npm: [Distribution Guide](./docs/distribution.md)
- License: [MIT](./LICENSE)

## Workspace layout

```
apps/
  identity/        Evantra Identity API (OAuth, tokens, userinfo)
  identity-web/    Hosted sign-in, registration and developer portal
  headquarters/    Corporate headquarters site
packages/
  sdk/             @evantra-identity/sdk                 (public)
  identity-react/  @evantra-identity/react      (public)
  …                internal workspace packages  (private)
docs/
  identity-client-integration.md
  publishing.md
```

## Development

Requires Node 18+ and pnpm. From this directory:

```bash
pnpm install
pnpm build       # turbo build across the workspace
pnpm typecheck   # turbo typecheck
pnpm lint        # turbo lint
pnpm dev         # turbo dev
```

To work on a single public package:

```bash
pnpm --filter @evantra-identity/sdk build
pnpm --filter @evantra-identity/react build
```

## Contributing

Issues and pull requests are welcome. Please run `pnpm typecheck` and
`pnpm build` before opening a PR, and keep the security notes in the
[integration guide](./docs/identity-client-integration.md#10-security-checklist)
true — PKCE on every flow, no client secrets in public clients.

## License

MIT © Evantra De-Buckman Ventures. See [LICENSE](./LICENSE).
