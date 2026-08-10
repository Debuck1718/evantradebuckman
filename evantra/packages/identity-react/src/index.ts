import {
  createContext,
  createElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";

export interface EvantraIdentityConfig {
  identityWebBaseUrl: string;
}

export interface EvantraAuthorizeParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  nonce?: string;
  responseType?: "code";
}

const defaultConfig: EvantraIdentityConfig = {
  identityWebBaseUrl: "http://localhost:3001",
};

const EvantraIdentityContext = createContext<EvantraIdentityConfig>(defaultConfig);

export function EvantraIdentityProvider(props: {
  config: EvantraIdentityConfig;
  children: ReactNode;
}): ReactElement {
  return createElement(
    EvantraIdentityContext.Provider,
    { value: props.config },
    props.children,
  );
}

export function useEvantraIdentity(): EvantraIdentityConfig {
  return useContext(EvantraIdentityContext);
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function createEvantraLoginUrl(baseUrl: string, returnTo?: string): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);

  if (!returnTo) {
    return `${normalizedBase}/login`;
  }

  return `${normalizedBase}/login?returnTo=${encodeURIComponent(returnTo)}`;
}

export function createEvantraRegisterUrl(baseUrl: string, returnTo?: string): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);

  if (!returnTo) {
    return `${normalizedBase}/register`;
  }

  return `${normalizedBase}/register?returnTo=${encodeURIComponent(returnTo)}`;
}

export function createEvantraAuthorizeUrl(baseUrl: string, params: EvantraAuthorizeParams): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const query = new URLSearchParams();

  query.set("client_id", params.clientId);
  query.set("redirect_uri", params.redirectUri);
  query.set("response_type", params.responseType ?? "code");

  if (params.scope) {
    query.set("scope", params.scope);
  }

  if (params.state) {
    query.set("state", params.state);
  }

  if (params.nonce) {
    query.set("nonce", params.nonce);
  }

  return `${normalizedBase}/oauth/authorize?${query.toString()}`;
}

export function EvantraSignInButton(props: {
  returnTo?: string;
  className?: string;
  children?: ReactNode;
  baseUrl?: string;
}): ReactElement {
  const context = useEvantraIdentity();
  const baseUrl = props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraLoginUrl(baseUrl, props.returnTo),
      className: props.className,
    },
    props.children ?? "Sign in with Evantra",
  );
}

export function EvantraRegisterButton(props: {
  returnTo?: string;
  className?: string;
  children?: ReactNode;
  baseUrl?: string;
}): ReactElement {
  const context = useEvantraIdentity();
  const baseUrl = props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraRegisterUrl(baseUrl, props.returnTo),
      className: props.className,
    },
    props.children ?? "Create Evantra account",
  );
}

export function EvantraAuthorizeButton(props: {
  authorize: EvantraAuthorizeParams;
  className?: string;
  children?: ReactNode;
  baseUrl?: string;
}): ReactElement {
  const context = useEvantraIdentity();
  const baseUrl = props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraAuthorizeUrl(baseUrl, props.authorize),
      className: props.className,
    },
    props.children ?? "Authorize with Evantra",
  );
}
