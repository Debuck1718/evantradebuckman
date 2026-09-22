import {
  UserConsent,
} from "./UserConsent";

/**
 * Persistence contract for
 * user consents.
 */
export interface UserConsentRepository {

  /**
   * Stores a new consent.
   */
  create(
    consent: UserConsent,
  ): Promise<void>;

  /**
   * Persists the revocation state
   * of an existing consent.
   */
  update(
    consent: UserConsent,
  ): Promise<void>;

  /**
   * Finds a consent by its
   * internal identifier.
   */
  findById(
    id: string,
  ): Promise<UserConsent | null>;

  /**
   * Finds a single consent for an
   * account, client and scope.
   */
  find(
    accountId: string,
    clientId: string,
    scope: string,
  ): Promise<UserConsent | null>;

  /**
   * Returns every consent recorded for
   * an account and client.
   */
  findByAccountAndClient(
    accountId: string,
    clientId: string,
  ): Promise<UserConsent[]>;

  /**
   * Returns every consent recorded
   * for an account.
   */
  findByAccountId(
    accountId: string,
  ): Promise<UserConsent[]>;

  /**
   * Returns every consent recorded
   * for a client.
   */
  findByClientId(
    clientId: string,
  ): Promise<UserConsent[]>;

  /**
   * Removes a consent.
   */
  delete(
    id: string,
  ): Promise<void>;

}