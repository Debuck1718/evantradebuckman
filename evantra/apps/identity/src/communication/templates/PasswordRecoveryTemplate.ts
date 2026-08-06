export class PasswordRecoveryTemplate {

  static render(params: {

    evantraId: string;

    token: string;

    expiresAt: Date;

  }) {

    return {

      subject:
        "Reset your Evantra password",

      text:

`Hello ${params.evantraId},

A password recovery request has been received.

Recovery token:

${params.token}

Expires:

${params.expiresAt.toISOString()}

If you didn't request this,
you can safely ignore this email.`,

      html:

`<h1>Password Recovery</h1>
<p>Hello <strong>${params.evantraId}</strong></p>
<p>Your recovery token is:</p>
<p><strong>${params.token}</strong></p>
<p>Expires: ${params.expiresAt.toISOString()}</p>`,

    };

  }

}