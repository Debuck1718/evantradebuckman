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

export function describeScopes(
  scope: string,
) {
  return scope
    .split(/\s+/)
    .filter(Boolean)
    .map((value) => ({
      scope: value,
      definition:
        OAUTH_SCOPES[
          value as OAuthScope
        ],
    }))
    .filter(
      (
        item,
      ): item is {
        scope: OAuthScope;
        definition:
          (typeof OAUTH_SCOPES)[OAuthScope];
      } => Boolean(item.definition),
    );
}