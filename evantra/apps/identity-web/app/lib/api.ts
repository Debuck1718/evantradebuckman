const API_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "http://localhost:4000";

// ======================================================
// Shared
// ======================================================

interface ApiError {
  error?: {
    message?: string;
  };
  message?: string;
}

// ======================================================
// Authentication
// ======================================================

export interface AuthenticateResponse {
  account: {
    id: string;
    firstName: string;
    lastName: string;
    evantraId: string;
    contactEmail: string;
    status?: string;
  };

  session: {
    id: string;
    sessionId: string;
    accountId: string;
    evantraId: string;
    expiresAt: string;
    idleTimeoutAt: string;
  };
}

// ======================================================
// Registration
// ======================================================

export interface RegisterAccountInput {
  firstName: string;
  lastName: string;
  evantraId: string;
  contactEmail: string;
  password: string;
}

export interface RegisterAccountResponse {
  account: {
    id: string;
    firstName: string;
    lastName: string;
    evantraId: string;
    contactEmail: string;
    status?: string;
  };
}

// ======================================================
// Verification
// ======================================================

export interface VerifyAccountResponse {
  success?: boolean;
  message?: string;
}

export interface ResendVerificationResponse {
  success?: boolean;
  message?: string;
}

// ======================================================
// Session
// ======================================================

export interface ValidateSessionResponse {
  account: {
    id: string;
    firstName: string;
    lastName: string;
    evantraId: string;
    contactEmail: string;
    status?: string;
  };

  session?: {
    id?: string;
    sessionId?: string;
    accountId?: string;
    evantraId?: string;
    expiresAt?: string;
    idleTimeoutAt?: string;
  };
}

// ======================================================
// Error helper
// ======================================================

async function readResponse<T>(
  response: Response,
): Promise<T> {
  let data: T & ApiError;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The identity service returned an invalid response.",
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        data?.message ??
        "The request could not be completed.",
    );
  }

  return data;
}

// ======================================================
// Authenticate
// ======================================================

export async function authenticate(
  evantraId: string,
  password: string,
): Promise<AuthenticateResponse> {
  const response = await fetch(
    `${API_URL}/identity/authenticate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        evantraId,
        password,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Authentication failed.",
    );
  }

  return data as AuthenticateResponse;
}

// ======================================================
// Register Account
// ======================================================

export async function registerAccount(
  input: RegisterAccountInput,
): Promise<RegisterAccountResponse> {
  const response = await fetch(
    `${API_URL}/identity/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        evantraId: input.evantraId.trim().toLowerCase(),
        contactEmail: input.contactEmail.trim(),
        password: input.password,
      }),

      cache: "no-store",
    },
  );

  return readResponse<RegisterAccountResponse>(
    response,
  );
}

// ======================================================
// Verification
// ======================================================

export interface VerifyAccountResponse {
  message?: string;
}

export interface ResendVerificationInput {
  contactEmail: string;
}

export interface ResendVerificationResponse {
  message?: string;
}

export async function verifyAccount(
  token: string,
): Promise<VerifyAccountResponse> {
  const response = await fetch(
    `${API_URL}/identity/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to verify your Evantra ID.",
    );
  }

  return data;
}

export async function resendVerification(
  input: ResendVerificationInput,
): Promise<ResendVerificationResponse> {
  const response = await fetch(
    `${API_URL}/identity/resend-verification`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        contactEmail:
          input.contactEmail,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to resend the verification email.",
    );
  }

  return data;
}

// ======================================================
// Validate Session
// ======================================================

export async function validateSession(
  sessionId?: string,
) {
  const response = await fetch(
    `${API_URL}/identity/session`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(
        sessionId
          ? { sessionId }
          : {},
      ),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Session validation failed.",
    );
  }

  return data;
}

// ======================================================
// Logout
// ======================================================

// ======================================================
// Logout
// ======================================================

export interface LogoutInput {
  sessionId: string;
}

export interface LogoutResponse {
  success: boolean;
}

export async function logout(
  sessionId: string,
): Promise<LogoutResponse> {
  const response = await fetch(
    `${API_URL}/identity/logout`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data =
    await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to sign out.",
    );
  }

  return data;
}

// ======================================================
// Forgot Password
// ======================================================

export interface ForgotPasswordInput {
  contactEmail: string;
}

export async function forgotPassword(
  contactEmail: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/identity/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        contactEmail,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to process your password recovery request.",
    );
  }
}

// ======================================================
// Reset Password
// ======================================================

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/identity/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token: input.token,
        password: input.password,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to reset your password.",
    );
  }
}

// ======================================================
// Change Password
// ======================================================

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/identity/change-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to change your password.",
    );
  }
}
// ======================================================
// Contact Email Change
// ======================================================

export interface RequestContactEmailChangeInput {
  sessionId: string;
  currentPassword: string;
  newContactEmail: string;
}

export interface RequestContactEmailChangeResponse {
  success?: boolean;
  message?: string;
}

export async function requestContactEmailChange(
  input: RequestContactEmailChangeInput,
): Promise<RequestContactEmailChangeResponse> {
  const response = await fetch(
    `${API_URL}/identity/contact-email/request`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId: input.sessionId,
        currentPassword: input.currentPassword,
        newContactEmail: input.newContactEmail,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        data?.message ??
        "Unable to request a contact email change.",
    );
  }

  return data;
}

// ======================================================
// Verify Contact Email Change
// ======================================================

export interface VerifyContactEmailChangeResponse {
  success?: boolean;
  message?: string;
  account?: {
    id: string;
    firstName: string;
    lastName: string;
    evantraId: string;
    contactEmail: string;
    status?: string;
  };
}

export async function verifyContactEmailChange(
  token: string,
): Promise<VerifyContactEmailChangeResponse> {
  const response = await fetch(
    `${API_URL}/identity/contact-email/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        data?.message ??
        "Unable to verify your contact email.",
    );
  }

  return data;
}

// ======================================================
// Browser Sessions / Security
// ======================================================

export interface BrowserSessionResponse {
  id?: string;

  sessionId: string;

  accountId: string;

  evantraId: string;

  authenticatedAt?: string;

  expiresAt: string;

  idleTimeoutAt: string;

  revokedAt?: string | null;

  terminatedAt?: string | null;

  lastActivityAt?: string;

  createdAt?: string;

  lifecycle?: {
    revoked?: boolean;
    terminated?: boolean;
  };
}

export interface ListBrowserSessionsResponse {
  sessions: BrowserSessionResponse[];
}

export interface RevokeAllBrowserSessionsResponse {
  revoked: number;
  skipped: number;
}

export interface RotateBrowserSessionResponse {
  session: BrowserSessionResponse;
}

export interface TouchSessionResponse {
  session: BrowserSessionResponse;
}

// ======================================================
// List Browser Sessions
// ======================================================

export async function listBrowserSessions(
  sessionId: string,
): Promise<ListBrowserSessionsResponse> {
  const response = await fetch(
    `${API_URL}/identity/sessions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to load your active sessions.",
    );
  }

  return data;
}

// ======================================================
// Revoke One Browser Session
// ======================================================

export async function revokeBrowserSession(
  sessionId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/identity/sessions`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to revoke this session.",
    );
  }
}

// ======================================================
// Revoke All Other Browser Sessions
// ======================================================

export async function revokeAllBrowserSessions(
  evantraId: string,
  exceptSessionId?: string,
): Promise<RevokeAllBrowserSessionsResponse> {
  const response = await fetch(
    `${API_URL}/identity/sessions/all`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        evantraId,
        ...(exceptSessionId
          ? { exceptSessionId }
          : {}),
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to revoke your other sessions.",
    );
  }

  return data;
}

// ======================================================
// Rotate Current Browser Session
// ======================================================

export async function rotateBrowserSession(
  currentSessionId: string,
): Promise<RotateBrowserSessionResponse> {
  const response = await fetch(
    `${API_URL}/identity/session/rotate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        currentSessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to refresh your security session.",
    );
  }

  return data;
}

// ======================================================
// Touch Current Browser Session
// ======================================================

export async function touchBrowserSession(
  sessionId: string,
): Promise<TouchSessionResponse> {
  const response = await fetch(
    `${API_URL}/identity/session/touch`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to refresh session activity.",
    );
  }

  return data;
}

// ======================================================
// Terminate Browser Session
// ======================================================

export async function terminateBrowserSession(
  sessionId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/identity/session/terminate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Unable to terminate this session.",
    );
  }
}

// ======================================================
// Validate Browser Session
// ======================================================

export async function validateBrowserSession(
  sessionId: string,
): Promise<ValidateSessionResponse> {
  const response = await fetch(
    `${API_URL}/identity/session`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        "Session validation failed.",
    );
  }

  return data;
}