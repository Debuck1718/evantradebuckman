/**
 * Multi-factor authentication methods.
 */
export enum MfaMethod {

  NONE =
    "none",

  EMAIL =
    "email",

  SMS =
    "sms",

  TOTP =
    "totp",

  PUSH =
    "push",

  PASSKEY =
    "passkey",

  SECURITY_KEY =
    "security_key",

}