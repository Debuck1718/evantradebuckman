/**
 * Shared brand constants for
 * Evantra email templates, kept
 * in sync with the Headquarters
 * design system (app/globals.css).
 */
export const BRAND = {

  name: "Evantra",

  company: "Evantra De-Buckman Ventures",

  tagline: "Engineering Technology That Serves People",

  /* Headquarters dark surface: --hero-overlay base (6,19,31) */
  surfaceDark: "#06131f",

  /* Engineering Blue: --primary (208 79% 28%) */
  primary: "#14507f",

  /* Innovation Teal: --secondary (174 77% 26%) */
  secondary: "#118a89",

  /* Evantra Gold: --ev-gold */
  gold: "#e6b24a",

  goldDark: "#c99322",

  /* Foreground: 215 28% 17% on white */
  text: "#1f2a37",

  textMuted: "#5b6b7b",

  border: "#e3e9ef",

  white: "#ffffff",

  /** Favicon pinwheel mark served from Headquarters. */
  logoUrl:
    process.env.EVANTRA_HEADQUARTERS_URL?.replace(/\/$/, "") ??
    "https://www.evantradebuckman.com",

  logoSrc:
    (process.env.EVANTRA_HEADQUARTERS_URL?.replace(/\/$/, "") ??
      "https://www.evantradebuckman.com") +
    "/icons/favicon.png",

  headquartersUrl:
    process.env.EVANTRA_HEADQUARTERS_URL?.replace(/\/$/, "") ??
    "https://www.evantradebuckman.com",

} as const;

/**
 * Renders the shared dark header
 * band used across Evantra emails:
 * gold pinwheel logo on the
 * headquarters midnight surface.
 */
export function renderBrandHeader(): string {

  return `
<tr>
  <td style="padding:32px 40px;background:${BRAND.surfaceDark};text-align:center;border-radius:20px 20px 0 0;">
    <img
      src="${BRAND.logoSrc}"
      width="64"
      height="64"
      alt="${BRAND.name}"
      style="display:inline-block;width:64px;height:64px;border-radius:16px;border:1px solid rgba(230,178,74,.35);"
    />
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:6px;color:${BRAND.gold};padding-top:14px;text-transform:uppercase;">
      ${BRAND.name}
    </div>
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.58);padding-top:6px;text-transform:uppercase;">
      ${BRAND.tagline}
    </div>
  </td>
</tr>`;

}

/**
 * Renders the shared footer with
 * headquarters contact details.
 */
export function renderBrandFooter(): string {

  return `
<tr>
  <td style="padding:28px 40px;background:#0b1c2b;border-radius:0 0 20px 20px;text-align:center;">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,.58);">
      ${BRAND.company}
    </p>
    <p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,.58);">
      <a href="${BRAND.headquartersUrl}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.headquartersUrl.replace(/^https?:\/\//, "")}</a>
      &nbsp;&middot;&nbsp;
      info@evantradebuckman.com
    </p>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,.38);">
      You received this email because an Evantra Account activity requires confirmation.
      If you didn&rsquo;t initiate it, you can safely ignore this message.
    </p>
  </td>
</tr>`;

}

export class AccountVerificationTemplate {

  static render(params: {

    evantraId: string;

    token: string;

    expiresAt: Date;

  }, verificationUrl: string) {

    const expires = params.expiresAt
      .toISOString()
      .replace("T", " ")
      .replace(".000Z", " UTC");

    return {

      subject:
        "Verify your Evantra Account",

      text:

`Hello ${params.evantraId},

Welcome to Evantra.

Your verification token is:

${params.token}

This token expires at:

${params.expiresAt.toISOString()}

Verify your account:

${verificationUrl}

— ${BRAND.company}
${BRAND.headquartersUrl}

`,

      html:

`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Verify your Evantra Account</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${BRAND.white};border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">

          ${renderBrandHeader()}

          <tr>
            <td style="padding:40px;font-family:Helvetica,Arial,sans-serif;color:${BRAND.text};">

              <h1 style="margin:0 0 8px;font-size:24px;line-height:1.3;color:${BRAND.text};">
                Verify your Evantra Account
              </h1>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.textMuted};">
                Hello <strong style="color:${BRAND.text};">${params.evantraId}</strong>, welcome to Evantra.
                Confirm this email address to activate your account and secure your
                place on the Evantra platform.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding:28px;background:#f4f6f8;border:1px solid ${BRAND.border};border-radius:14px;">
                    <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.textMuted};">
                      Verification token
                    </p>
                    <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:26px;letter-spacing:4px;color:${BRAND.primary};font-weight:bold;">
                      ${params.token}
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 24px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;padding:16px 40px;background:${BRAND.primary};color:${BRAND.white};font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;border-radius:12px;">
                      Verify my account&nbsp;&rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">
                Or copy this link into your browser:
              </p>
              <p style="margin:0 0 20px;font-size:13px;line-height:1.6;word-break:break-all;">
                <a href="${verificationUrl}" style="color:${BRAND.secondary};">${verificationUrl}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BRAND.border};">
                <tr>
                  <td style="padding-top:18px;font-size:13px;line-height:1.6;color:${BRAND.textMuted};">
                    <p style="margin:0 0 6px;">This token expires on <strong style="color:${BRAND.text};">${expires}</strong>.</p>
                    <p style="margin:0;">If you didn&rsquo;t create an Evantra Account, you can safely ignore this email &mdash; no account will be activated.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${renderBrandFooter()}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

    };

  }

}