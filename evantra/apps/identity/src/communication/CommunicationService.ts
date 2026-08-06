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

  }): Promise<void> {

    const template =
      AccountVerificationTemplate.render(

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