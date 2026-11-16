import {
  BRAND,
  renderBrandFooter,
  renderBrandHeader,
} from "./AccountVerificationTemplate";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
}

export class PasswordRecoveryTemplate {
  static render(
    params: {
      evantraId: string;
      token: string;
      expiresAt: Date;
    },
    resetUrl: string,
  ) {
    const expires = params.expiresAt
      .toISOString()
      .replace("T", " ")
      .replace(".000Z", " UTC");
    const safeEvantraId = escapeHtml(params.evantraId);
    const safeResetUrl = escapeHtml(resetUrl);

    return {
      subject: "Reset your Evantra password",
      text: `Hello ${params.evantraId},

We received a request to reset the password for your Evantra Account.

Reset your password using this secure link:
${resetUrl}

This link expires on ${expires}.

If you didn't request a password reset, you can safely ignore this email. Your password will not change.`,
      html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Reset your Evantra password</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${BRAND.white};border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">
          ${renderBrandHeader()}
          <tr>
            <td style="padding:40px;font-family:Helvetica,Arial,sans-serif;color:${BRAND.text};">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:${BRAND.text};">Reset your password</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.textMuted};">Hello <strong style="color:${BRAND.text};">${safeEvantraId}</strong>, we received a request to reset your Evantra Account password. Use the secure link below to choose a new password.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 24px;">
                    <a href="${safeResetUrl}" style="display:inline-block;padding:16px 40px;background:${BRAND.primary};color:${BRAND.white};font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;border-radius:12px;">Reset my password&nbsp;&rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">If the button doesn&rsquo;t work, copy this link into your browser:</p>
              <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;"><a href="${safeResetUrl}" style="color:${BRAND.secondary};">${safeResetUrl}</a></p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BRAND.border};">
                <tr>
                  <td style="padding-top:18px;font-size:13px;line-height:1.6;color:${BRAND.textMuted};">
                    <p style="margin:0 0 6px;">This link expires on <strong style="color:${BRAND.text};">${expires}</strong>.</p>
                    <p style="margin:0;">If you didn&rsquo;t request a password reset, you can safely ignore this email. Your password will not change.</p>
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