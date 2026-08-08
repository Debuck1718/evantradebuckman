import {
  Account,
} from "./Account";

import {
  AccountRepository,
} from "./AccountRepository";

import {
  ContactEmail,
} from "./ContactEmail";

import {
  EvantraId,
} from "./EvantraId";

/**
 * Coordinates operations involving
 * Evantra Accounts.
 *
 * This service manages the Account
 * lifecycle but does not handle:
 *
 * - Authentication
 * - Passwords
 * - Sessions
 * - Verification
 * - OAuth
 */
export class AccountService {

  constructor(
    private readonly repository:
      AccountRepository,
  ) {}

  /**
 * Registers a new account.
 */
async register(params: {
  id: string;

  firstName: string;

  lastName: string;

  evantraId: string;

  contactEmail: string;
}): Promise<Account> {

  const evantraId =
    EvantraId.from(
      params.evantraId,
    );

  const contactEmail =
    ContactEmail.from(
      params.contactEmail,
    );

  const existingIdentity =
    await this.repository.findByEvantraId(
      evantraId,
    );

  if (existingIdentity) {
    throw new Error(
      "Evantra ID already exists.",
    );
  }

  const existingEmail =
    await this.repository.findByContactEmail(
      contactEmail,
    );

  if (existingEmail) {
    throw new Error(
      "Contact email already exists.",
    );
  }

  const account =
    Account.create({

      id:
        params.id,

      firstName:
        params.firstName,

      lastName:
        params.lastName,

      evantraId,

      contactEmail,

    });

  await this.repository.create(
    account,
  );

  return account;
}

  /**
   * Finds an account by ID.
   */
  async findById(
    id: string,
  ): Promise<Account | null> {

    return this.repository.findById(
      id,
    );

  }

  /**
   * Finds an account by
   * Evantra ID.
   */
  async findByEvantraId(
    value: string,
  ): Promise<Account | null> {

    return this.repository.findByEvantraId(
      EvantraId.from(
        value,
      ),
    );

  }

  /**
   * Finds an account by
   * contact email.
   */
  async findByContactEmail(
    value: string,
  ): Promise<Account | null> {

    return this.repository.findByContactEmail(
      ContactEmail.from(
        value,
      ),
    );

  }

  /**
   * Changes an account's
   * contact email.
   */
  async changeContactEmail(
    account: Account,
    contactEmail: string,
  ): Promise<void> {

    account.changeContactEmail(

      ContactEmail.from(
        contactEmail,
      ),

    );

    await this.repository.update(
      account,
    );

  }

  /**
   * Activates the account.
   */
  async activate(
    account: Account,
  ): Promise<void> {

    account.activate();

    await this.repository.update(
      account,
    );

  }

  /**
   * Suspends the account.
   */
  async suspend(
    account: Account,
  ): Promise<void> {

    account.suspend();

    await this.repository.update(
      account,
    );

  }

  /**
   * Disables the account.
   */
  async disable(
    account: Account,
  ): Promise<void> {

    account.disable();

    await this.repository.update(
      account,
    );

  }

  /**
   * Updates an account.
   */
  async update(
    account: Account,
  ): Promise<void> {

    await this.repository.update(
      account,
    );

  }

  /**
   * Deletes an account.
   */
  async delete(
    account: Account,
  ): Promise<void> {

    account.delete();

    await this.repository.update(
      account,
    );

  }

}