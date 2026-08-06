import {
  EmailChange,
} from "./EmailChange";

/**
 * Persistence contract
 * for pending contact
 * email changes.
 */
export interface EmailChangeRepository {

  create(
    request: EmailChange,
  ): Promise<void>;

  update(
    request: EmailChange,
  ): Promise<void>;

  findById(
    id: string,
  ): Promise<EmailChange | null>;

  findByToken(
    token: string,
  ): Promise<EmailChange | null>;

  findByAccountId(
    accountId: string,
  ): Promise<EmailChange | null>;

  delete(
    id: string,
  ): Promise<void>;

}