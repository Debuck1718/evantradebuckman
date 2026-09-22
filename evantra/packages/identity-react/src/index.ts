import {
  createContext,
  createElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  createEvantraAuthorizeUrl,
  createEvantraLoginUrl,
  createEvantraRegisterUrl,
  defaultIdentityWebBaseUrl,
  normalizeBaseUrl,
  type EvantraAuthorizeParams,
} from "./oauth";

/*
 * Re-export the framework-agnostic OAuth
 * core so web, React Native and Expo
 * clients can share one implementation.
 */
export * from "./oauth";

export interface EvantraIdentityConfig {
  identityWebBaseUrl: string;

  /**
   * Identity API origin.
   *
   * Required for token exchange and
   * UserInfo calls. Defaults to the
   * production identity service.
   */
  identityApiBaseUrl?: string;

  /**
   * OAuth client identifier issued from
   * the Evantra workspace.
   */
  clientId?: string;
}

const defaultConfig: EvantraIdentityConfig = {
  identityWebBaseUrl:
    defaultIdentityWebBaseUrl(),
};

const EvantraIdentityContext =
  createContext<EvantraIdentityConfig>(
    defaultConfig,
  );

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

/*
 * The low-level URL builders now live in
 * ./oauth and are re-exported above, so
 * they are intentionally not redefined
 * here.
 */

/* ------------------------------------------------------------------ */
/* React components                                                    */
/* ------------------------------------------------------------------ */

export function EvantraSignInButton(props: {
  returnTo?: string;
  className?: string;
  children?: ReactNode;
  baseUrl?: string;
}): ReactElement {
  const context = useEvantraIdentity();
  const baseUrl =
    props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraLoginUrl(
        baseUrl,
        props.returnTo,
      ),
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
  const baseUrl =
    props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraRegisterUrl(
        baseUrl,
        props.returnTo,
      ),
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
  const baseUrl =
    props.baseUrl ?? context.identityWebBaseUrl;

  return createElement(
    "a",
    {
      href: createEvantraAuthorizeUrl(
        baseUrl,
        props.authorize,
      ),
      className: props.className,
    },
    props.children ?? "Authorize with Evantra",
  );
}

/**
 * Convenience helper that resets a
 * configuration object to the
 * production defaults.
 */
export function createEvantraIdentityConfig(
  config: Partial<EvantraIdentityConfig>,
): EvantraIdentityConfig {
  return {
    identityWebBaseUrl: normalizeBaseUrl(
      config.identityWebBaseUrl ??
        defaultConfig.identityWebBaseUrl,
    ),
    ...(config.identityApiBaseUrl
      ? {
          identityApiBaseUrl: normalizeBaseUrl(
            config.identityApiBaseUrl,
          ),
        }
      : {}),
    ...(config.clientId
      ? { clientId: config.clientId }
      : {}),
  };
}
