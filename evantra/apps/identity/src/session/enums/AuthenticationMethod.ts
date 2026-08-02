/**
 * Authentication methods supported
 * by Evantra Identity.
 *
 * RFC8176
 * WebAuthn
 * OAuth
 * OpenID Connect
 */
export enum AuthenticationMethod {

  PASSWORD =
    "password",

  PASSKEY =
    "passkey",

  PASSWORDLESS =
    "passwordless",

  MAGIC_LINK =
    "magic_link",

  EMAIL_OTP =
    "email_otp",

  SMS_OTP =
    "sms_otp",

  TOTP =
    "totp",

  PUSH =
    "push",

  SECURITY_KEY =
    "security_key",

  BIOMETRIC =
    "biometric",

  SOCIAL =
    "social",

  ENTERPRISE =
    "enterprise",

  API_KEY =
    "api_key",

}