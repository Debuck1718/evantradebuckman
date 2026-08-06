import { AccountStatus } from "./AccountStatus";
import { ContactEmail } from "./ContactEmail";
import { EvantraId } from "./EvantraId";

/**
 * Represents an Evantra Account.
 *
 * The Account is responsible for
 * protecting its own state and
 * enforcing account lifecycle rules.
 */
export class Account {

  /**
   * Creates a new Account.
   */
  private constructor(

  public readonly id: string,

  public readonly evantraId: EvantraId,

  public contactEmail: ContactEmail,

  private status: AccountStatus,

  public readonly createdAt: Date,

  private updatedAt: Date,

) {}

  /**
   * Creates a brand-new Account.
   *
   * New accounts always begin in the
   * PENDING_VERIFICATION state.
   */
  static create(params: {
    id: string;
    evantraId: EvantraId;
    contactEmail: ContactEmail;
  }): Account {

    const now = new Date();

    return new Account(
      params.id,
      params.evantraId,
      params.contactEmail,
      AccountStatus.PENDING_VERIFICATION,
      now,
      now
    );
  }

  /**
   * Restores an existing Account
   * from persistent storage.
   *
   * This method is intended to be
   * used only by repository
   * implementations.
   */
  static restore(params: {
    id: string;
    evantraId: EvantraId;
    contactEmail: ContactEmail;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Account {

    return new Account(
      params.id,
      params.evantraId,
      params.contactEmail,
      params.status,
      new Date(params.createdAt),
      new Date(params.updatedAt)
    );
  }

  /**
   * Returns the current account status.
   */
  getStatus(): AccountStatus {
    return this.status;
  }

  /**
 * Returns the account's
 * contact email.
 */
getContactEmail(): ContactEmail {

  return this.contactEmail;

}

  /**
   * Returns true if the account
   * is active.
   */
  isActive(): boolean {
    return this.status === AccountStatus.ACTIVE;
  }

  /**
   * Activates the account.
   */
  activate(): void {

    if (this.status === AccountStatus.DELETED) {
      throw new Error(
        "Deleted accounts cannot be activated."
      );
    }

    this.status = AccountStatus.ACTIVE;

    this.touch();
  }

  /**
 * Changes the account's
 * contact email.
 */
changeContactEmail(
  contactEmail: ContactEmail,
): void {

  this.contactEmail =
    contactEmail;

  this.touch();

}

  /**
   * Suspends the account.
   */
  suspend(): void {

    if (this.status === AccountStatus.DELETED) {
      throw new Error(
        "Deleted accounts cannot be suspended."
      );
    }

    this.status = AccountStatus.SUSPENDED;

    this.touch();
  }

  /**
   * Disables the account.
   */
  disable(): void {

    if (this.status === AccountStatus.DELETED) {
      throw new Error(
        "Deleted accounts cannot be disabled."
      );
    }

    this.status = AccountStatus.DISABLED;

    this.touch();
  }

  /**
   * Permanently deletes the account.
   */
  delete(): void {

    this.status = AccountStatus.DELETED;

    this.touch();
  }

  /**
   * Returns the last update time.
   */
  updated(): Date {
    return this.updatedAt;
  }

  /**
   * Updates the modification timestamp.
   */
  private touch(): void {
    this.updatedAt = new Date();
  }

}