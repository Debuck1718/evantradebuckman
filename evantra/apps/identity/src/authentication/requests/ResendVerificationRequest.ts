/**
 * Request body for resending
 * account verification.
 */
export interface ResendVerificationRequest {
  readonly contactEmail: string;
}