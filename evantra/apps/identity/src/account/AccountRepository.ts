import { Account } from "./Account";
import { ContactEmail } from "./ContactEmail";
import { EvantraId } from "./EvantraId";

/**
 * Defines the persistence contract
 * for Evantra Accounts.
 *
 * Repository implementations are
 * responsible for storing and
 * retrieving Account entities.
 */
export interface AccountRepository {

  /**
   * Stores a new account.
   */
  create(
    account: Account
  ): Promise<void>;

  /**
   * Persists changes made to
   * an existing account.
   */
  update(
    account: Account
  ): Promise<void>;

  /**
   * Finds an account by its
   * unique identifier.
   */
  findById(
    id: string
  ): Promise<Account | null>;

  /**
   * Finds an account using
   * its Evantra ID.
   */
  findByEvantraId(
    evantraId: EvantraId
  ): Promise<Account | null>;

  /**
   * Finds an account using
   * its contact email.
   */
  findByContactEmail(
    contactEmail: ContactEmail
  ): Promise<Account | null>;

  /**
   * Removes an account.
   */
  delete(
    id: string
  ): Promise<void>;
}