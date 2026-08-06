export class AccountVerificationTemplate {

  static render(params: {

    evantraId: string;

    token: string;

    expiresAt: Date;

  }) {

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

`,

      html:

`<h1>Verify your Evantra Account</h1>
<p>Hello <strong>${params.evantraId}</strong></p>
<p>Your verification token is:</p>
<p><strong>${params.token}</strong></p>
<p>Expires: ${params.expiresAt.toISOString()}</p>`,

    };

  }

}