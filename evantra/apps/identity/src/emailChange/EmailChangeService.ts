import {
  EmailChange,
} from "./EmailChange";

import {
  EmailChangeRepository,
} from "./EmailChangeRepository";

import {
  Clock,
} from "../platform/Clock";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  TokenGenerator,
} from "../platform/TokenGenerator";

/**
 * Coordinates pending
 * contact email changes.
 */
export class EmailChangeService {

  constructor(

    private readonly repository:
      EmailChangeRepository,

    private readonly ids:
      IdGenerator,

    private readonly tokens:
      TokenGenerator,

    private readonly clock:
      Clock,

  ) {}

  /**
   * Creates a request.
   */
  async create(params: {

    accountId: string;

    newContactEmail: string;

  }): Promise<EmailChange> {

    const request =
      EmailChange.create({

        id:

          this.ids.emailChange(),

        accountId:

          params.accountId,

        newContactEmail:

          params.newContactEmail,

        token:

          this.tokens.verification(),

        expiresAt:

          this.clock.afterMinutes(30),

      });

    await this.repository.create(

      request,

    );

    return request;

  }

  async findByToken(
    token: string,
  ): Promise<EmailChange | null> {

    return this.repository.findByToken(
      token,
    );

  }

  async findByAccountId(
    accountId: string,
  ): Promise<EmailChange | null> {

    return this.repository.findByAccountId(
      accountId,
    );

  }

  async verify(
    request: EmailChange,
  ): Promise<void> {

    request.verify();

    await this.repository.update(
      request,
    );

  }

  async delete(
    id: string,
  ): Promise<void> {

    await this.repository.delete(
      id,
    );

  }

}