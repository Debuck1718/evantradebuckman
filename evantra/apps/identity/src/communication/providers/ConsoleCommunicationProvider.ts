import {
  CommunicationProvider,
} from "../CommunicationProvider";

/**
 * Development communication
 * provider.
 *
 * Writes outbound emails
 * to the console.
 */
export class ConsoleCommunicationProvider
implements CommunicationProvider {

  async sendEmail(params: {

    to: string;

    subject: string;

    html: string;

    text: string;

  }): Promise<void> {

    console.log("");

    console.log("========================================");

    console.log(" Evantra Communication");

    console.log("========================================");

    console.log("To      :", params.to);

    console.log("Subject :", params.subject);

    console.log("");

    console.log(params.text);

    console.log("");

    console.log("========================================");

    console.log("");

  }

}