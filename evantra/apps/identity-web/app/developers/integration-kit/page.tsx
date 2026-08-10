import { IdentityShell } from "../../../components/identity/IdentityShell";

const installCommand = "pnpm add @evantra/identity-react";

const reactUsage = `import {\n  EvantraIdentityProvider,\n  EvantraSignInButton,\n  EvantraRegisterButton,\n} from \"@evantra/identity-react\";\n\nexport function LoginSection() {\n  return (\n    <EvantraIdentityProvider\n      config={{ identityWebBaseUrl: \"https://identity.evantradebuckman.com\" }}\n    >\n      <EvantraSignInButton className=\"btn\" returnTo=\"/app\">\n        Sign in with Evantra\n      </EvantraSignInButton>\n\n      <EvantraRegisterButton className=\"btn\" returnTo=\"/app\">\n        Create account\n      </EvantraRegisterButton>\n    </EvantraIdentityProvider>\n  );\n}`;

const oauthUsage = `import {\n  createEvantraAuthorizeUrl,\n} from \"@evantra/identity-react\";\n\nconst url = createEvantraAuthorizeUrl(\n  \"https://identity.evantradebuckman.com\",\n  {\n    clientId: \"your-client-id\",\n    redirectUri: \"https://app.example.com/oauth/callback\",\n    scope: \"openid profile email\",\n    state: crypto.randomUUID(),\n    nonce: crypto.randomUUID(),\n  },\n);`;

export default function IntegrationKitPage() {
  return (
    <IdentityShell
      title="React and Next integration kit"
      description="Install Evantra Identity components and URL helpers in your own app with minimal setup."
    >
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Installation
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Add Evantra Identity to your app
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Use the package for React and Next apps to render sign-in/register buttons and generate safe OAuth URLs.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-[#f5d48a]">
            <code>{installCommand}</code>
          </pre>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            React / Next usage
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/80">
            <code>{reactUsage}</code>
          </pre>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            OAuth authorize helper
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/80">
            <code>{oauthUsage}</code>
          </pre>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h4 className="text-lg font-semibold text-white">Integration checklist</h4>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>- Register your OAuth client in Evantra Identity first.</li>
            <li>- Use exact redirect URIs and keep client secrets server-side.</li>
            <li>- Use PKCE and state/nonce values for every authorization request.</li>
            <li>- Keep app-level authorization in your product, not identity.</li>
          </ul>
        </section>
      </div>
    </IdentityShell>
  );
}

