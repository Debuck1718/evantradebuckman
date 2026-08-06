/**
 * Template sent after a
 * contact email has been
 * successfully changed.
 */
export class ContactEmailChangedTemplate {

  static render(params: {

    evantraId: string;

  }) {

    return {

      subject:
        "Your Evantra contact email has been updated",

      text:
`Hello ${params.evantraId},

Your Evantra Account contact email
has been successfully updated.

If you made this change,
no further action is required.

If you did NOT make this change,
please reset your password
immediately and contact Evantra
Support.`,

      html: `
<h2>Your contact email has been updated</h2>

<p>Hello ${params.evantraId},</p>

<p>Your Evantra Account contact email has been successfully updated.</p>

<p>If you made this change,
no further action is required.</p>

<p>If you did <strong>not</strong> make this change,
please reset your password immediately
and contact Evantra Support.</p>
`,

    };

  }

}