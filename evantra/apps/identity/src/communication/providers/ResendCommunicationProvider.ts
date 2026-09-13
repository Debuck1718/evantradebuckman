import {
  CommunicationProvider,
} from "../CommunicationProvider";

/**
 * Sends outbound email through Resend.
 */
export class ResendCommunicationProvider
  implements CommunicationProvider {

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text,
        }),
      },
    );

    if (!response.ok) {
      const details =
        await response.text();

      throw new Error(
        `Email delivery failed (${response.status}): ${details}`,
      );
    }
  }
}