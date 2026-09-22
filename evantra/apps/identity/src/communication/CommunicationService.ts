import {
  CommunicationProvider,
} from "./CommunicationProvider";

import {
  AccountVerificationTemplate,
} from "./templates/AccountVerificationTemplate";

import { PasswordChangedTemplate } from "./templates/PasswordChangedTemplate";

import {
  PasswordRecoveryTemplate,
} from "./templates/PasswordRecoveryTemplate";

import {
  ContactEmailVerificationTemplate,
} from "./templates/ContactEmailVerificationTemplate";

import {
  ContactEmailChangedTemplate,
} from "./templates/ContactEmailChangedTemplate";
/**
 * Builds the returnTo query fragment
 * for a verification link.
 *
 * Only same-origin relative paths are
 * forwarded, and the value is always
 * URL encoded. Anything else is
 * dropped so a crafted registration
 * cannot turn a verification email
 * into an open redirect.
 */
function buildReturnToQuery(
  returnTo?: string | null,
): string {

  if (!returnTo) {

    return "";

  }

  const value = returnTo.trim();

  if (
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {

    return "";

  }

  return `&returnTo=${encodeURIComponent(
    value,
  )}`;

}

/**
 * Coordinates outbound
 * communications.
 */
export class CommunicationService {

  constructor(

    private readonly provider:
      CommunicationProvider,

  ) {}

  /**
   * Sends an account
   * verification email.
   */
  async sendAccountVerification(params: {

    contactEmail: string;

    evantraId: string;

    token: string;

    expiresAt: Date;

    /**
     * Optional same-origin path the
     * visitor should be returned to
     * after verifying.
     *
     * This is how an OAuth client keeps
     * its authorization round-trip alive
     * across registration and email
     * verification.
     */
    returnTo?: string | null;

  }): Promise<void> {

    const verificationUrl =
      `${(
        process.env.EVANTRA_IDENTITY_WEB_URL ??
        "http://localhost:3001"
      ).replace(/\/$/, "")}/verify?token=${encodeURIComponent(
        params.token,
      )}${buildReturnToQuery(
        params.returnTo,
      )}`;

    const template =
      AccountVerificationTemplate.render(

        params,

        verificationUrl,

      );

    await this.provider.sendEmail({

      to:
        params.contactEmail,

      subject:
        template.subject,

      html:
        template.html,

      text:
        template.text,

    });

  }

  /**
   * Sends a password
   * recovery email.
   */
  async sendPasswordRecovery(params: {

    contactEmail: string;

    evantraId: string;

    token: string;

    expiresAt: Date;

  }): Promise<void> {

    const template =
      PasswordRecoveryTemplate.render(

        params,

      );

    await this.provider.sendEmail({

      to:
        params.contactEmail,

      subject:
        template.subject,

      html:
        template.html,

      text:
        template.text,

    });

  }

  /**
 * Sends a password
 * changed notification.
 */
async sendPasswordChanged(params: {

  contactEmail: string;

  evantraId: string;

}): Promise<void> {

  const template =
    PasswordChangedTemplate.render(

      params,

    );

  await this.provider.sendEmail({

    to:
      params.contactEmail,

    subject:
      template.subject,

    html:
      template.html,

    text:
      template.text,

  });

}

/**
 * Sends contact email
 * verification.
 */
async sendContactEmailVerification(params: {

  contactEmail: string;

  evantraId: string;

  token: string;

  expiresAt: Date;

}): Promise<void> {

  const template =
    ContactEmailVerificationTemplate.render(

      params,

    );

  await this.provider.sendEmail({

    to:
      params.contactEmail,

    subject:
      template.subject,

    html:
      template.html,

    text:
      template.text,

  });

}

/**
 * Sends a notification that
 * the contact email has
 * changed successfully.
 */
async sendContactEmailChanged(params: {

  contactEmail: string;

  evantraId: string;

}): Promise<void> {

  const template =
    ContactEmailChangedTemplate.render(

      params,

    );

  await this.provider.sendEmail({

    to:
      params.contactEmail,

    subject:
      template.subject,

    html:
      template.html,

    text:
      template.text,

  });

}

}