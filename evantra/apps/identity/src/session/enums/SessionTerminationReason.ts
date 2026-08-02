/**
 * Why a session ended.
 */
export enum SessionTerminationReason {

  USER =
    "user",

  TIMEOUT =
    "timeout",

  ABSOLUTE_TIMEOUT =
    "absolute_timeout",

  ADMIN =
    "admin",

  SECURITY =
    "security",

  SYSTEM =
    "system",

}