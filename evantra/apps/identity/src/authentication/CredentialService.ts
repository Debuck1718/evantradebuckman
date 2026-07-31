import { Credential } from "./Credential";
import { CredentialRepository } from "./CredentialRepository";

/**
 * Defines the operations required
 * to hash and verify passwords.
 *
 * Implementations may use Argon2,
 * bcrypt or any future algorithm.
 */
export interface PasswordHasher {

  /**
   * Produces a secure password hash.
   */
  hash(
    password: string
  ): Promise<string>;

  /**
   * Verifies a password against
   * a stored hash.
   */
  verify(
    password: string,
    hash: string
  ): Promise<boolean>;
}

/**
 * Coordinates Credential
 * operations.
 *
 * This service does not implement
 * cryptographic algorithms itself.
 */
export class CredentialService {

  constructor(
    private readonly repository: CredentialRepository,
    private readonly hasher: PasswordHasher
  ) {}

  /**
   * Creates a credential for
   * an account.
   */
  async create(params: {
    accountId: string;
    password: string;
  }): Promise<Credential> {

    const hash =
      await this.hasher.hash(
        params.password
      );

    const credential =
      Credential.create({
        accountId: params.accountId,
        passwordHash: hash,
      });

    await this.repository.create(
      credential
    );

    return credential;
  }

  /**
   * Verifies an account password.
   */
  async verify(
    accountId: string,
    password: string
  ): Promise<boolean> {

    const credential =
      await this.repository.findByAccountId(
        accountId
      );

    if (!credential) {
      return false;
    }

    return this.hasher.verify(
      password,
      credential.hash()
    );
  }

  /**
   * Changes an account password.
   */
  async changePassword(
    accountId: string,
    password: string
  ): Promise<void> {

    const credential =
      await this.repository.findByAccountId(
        accountId
      );

    if (!credential) {
      throw new Error(
        "Credential not found."
      );
    }

    const hash =
      await this.hasher.hash(
        password
      );

    credential.changePassword(
      hash
    );

    await this.repository.update(
      credential
    );
  }

  /**
   * Removes an account credential.
   */
  async delete(
    accountId: string
  ): Promise<void> {

    await this.repository.delete(
      accountId
    );
  }
}