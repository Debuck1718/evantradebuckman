export class PasswordChangedTemplate {

  static render(params: {

    evantraId: string;

  }) {

    return {

      subject:
        "Your Evantra password has been changed",

      text:

`Hello ${params.evantraId},

Your Evantra Account password has been changed successfully.

If you performed this action, no further action is required.

If you did NOT change your password, please secure your account immediately and contact Evantra Support.`,

      html:

`<h1>Password Changed</h1>

<p>Hello <strong>${params.evantraId}</strong>,</p>

<p>Your Evantra password has been changed successfully.</p>

<p>If you did not perform this action, contact Evantra Support immediately.</p>`,

    };

  }

}