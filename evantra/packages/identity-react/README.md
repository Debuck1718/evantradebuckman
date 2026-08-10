# @evantra/identity-react

React and Next.js integration components for Evantra Identity.

## Install

```bash
pnpm add @evantra/identity-react
```

## Quick Start

```tsx
import {
  EvantraIdentityProvider,
  EvantraSignInButton,
  EvantraRegisterButton,
} from "@evantra/identity-react";

export function AuthButtons() {
  return (
    <EvantraIdentityProvider
      config={{ identityWebBaseUrl: "https://identity.evantra.com" }}
    >
      <EvantraSignInButton returnTo="/app" className="btn">
        Sign in with Evantra
      </EvantraSignInButton>

      <EvantraRegisterButton returnTo="/app" className="btn">
        Create account
      </EvantraRegisterButton>
    </EvantraIdentityProvider>
  );
}
```

## OAuth URL Helper

```ts
import { createEvantraAuthorizeUrl } from "@evantra/identity-react";

const url = createEvantraAuthorizeUrl("https://identity.evantra.com", {
  clientId: "your-client-id",
  redirectUri: "https://app.example.com/oauth/callback",
  scope: "openid profile email",
  state: crypto.randomUUID(),
  nonce: crypto.randomUUID(),
});
```

## Security Notes

- Keep client secrets on server-side systems.
- Always use PKCE and state/nonce values for OAuth flows.
- Keep application authorization logic in your app, not identity.
