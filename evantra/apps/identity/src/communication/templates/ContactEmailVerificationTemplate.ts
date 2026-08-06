export class ContactEmailVerificationTemplate {

  static render(params: {

    evantraId: string;

    token: string;

    expiresAt: Date;

  }) {

    return {

      subject:

        "Confirm your new Evantra contact email",

      text:

`Hello ${params.evantraId},

A request was made to change the
contact email for your Evantra Account.

Verification token:

${params.token}

Expires:

${params.expiresAt.toISOString()}

If you didn't request this,
ignore this message.`,

      html: `
<h2>Confirm your new contact email</h2>

<p>Hello ${params.evantraId},</p>

<p>A request was made to change the contact email for your Evantra Account.</p>

<p><strong>Verification token</strong></p>

<p>${params.token}</p>

<p>Expires:</p>

<p>${params.expiresAt.toISOString()}</p>

<p>If you didn't request this, ignore this message.</p>
`,

    };

  }

}