/**
 * Why a session was revoked.
 */
export enum RevocationReason {

  LOGOUT =
    "logout",

  PASSWORD_CHANGED =
    "password_changed",

  ADMIN =
    "admin",

  RISK =
    "risk",

  COMPROMISED =
    "compromised",

  TOKEN_REUSE =
    "token_reuse",

  ACCOUNT_DISABLED =
    "account_disabled",

}