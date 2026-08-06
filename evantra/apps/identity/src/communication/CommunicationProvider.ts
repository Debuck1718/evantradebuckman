/**
 * Defines the contract for
 * outbound communications.
 */
export interface CommunicationProvider {

  /**
   * Sends an email.
   */
  sendEmail(params: {

    to: string;

    subject: string;

    html: string;

    text: string;

  }): Promise<void>;

}