export const OAUTH_SCOPES = {
  openid: {
    title: "Sign you in with Evantra",
    description:
      "Allows this application to authenticate you using your Evantra identity.",
  },

  profile: {
    title: "Access your basic identity",
    description:
      "Allows this application to access basic identity information.",
  },

  email: {
    title: "Access your verified contact email",
    description:
      "Allows this application to access your verified contact email.",
  },
} as const;

export type OAuthScope =
  keyof typeof OAUTH_SCOPES;

/**
 * The scope set Evantra Identity grants when an
 * authorization request omits `scope`.
 *
 * Kept in step with the SDK's EVANTRA_DEFAULT_SCOPE and
 * the identity service's registered default, so the
 * consent screen discloses exactly what will be
 * granted.
 */
export const EVANTRA_DEFAULT_SCOPE =
  "openid profile email";

interface DescribedScope {
  scope: string;
  definition: {
    title: string;
    description: string;
  };
  /**
   * True when the scope is not in OAUTH_SCOPES.
   * The consent screen still has to disclose it,
   * so it is shown by its raw name instead of
   * being dropped.
   */
  unknown?: boolean;
}

/**
 * Turns a space-delimited scope string into the
 * entries the consent screens render.
 *
 * Every requested scope is returned. Previously
 * any scope missing from OAUTH_SCOPES was filtered
 * out, so a request such as "workspace:read"
 * produced an empty list and the page told the
 * user "No specific scopes were requested" while
 * the URL plainly asked for one. Under-reporting
 * access on a consent screen is the one failure
 * mode that must never happen, so unknown scopes
 * are disclosed verbatim.
 */
export function describeScopes(
  scope: string,
): DescribedScope[] {
  return scope
    .split(/\s+/)
    .filter(Boolean)
    .map((value): DescribedScope => {
      const known =
        OAUTH_SCOPES[value as OAuthScope];

      if (known) {
        return {
          scope: value,
          definition: known,
        };
      }

      return {
        scope: value,
        definition: {
          title: value,
          description:
            "This application is requesting a scope Evantra Identity does not have a friendly name for.",
        },
        unknown: true,
      };
    });
}