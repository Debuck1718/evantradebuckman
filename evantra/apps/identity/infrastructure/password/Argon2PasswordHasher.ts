import argon2 from "argon2";

import {
  PasswordHasher,
} from "../../src/authentication";

/**
 * Argon2 password hasher.
 */
export class Argon2PasswordHasher
  implements PasswordHasher {

  /**
   * Produces a password hash.
   */
  async hash(
    password: string
  ): Promise<string> {

    return argon2.hash(
      password
    );
  }

  /**
   * Verifies a password.
   */
  async verify(
    password: string,
    hash: string
  ): Promise<boolean> {

    return argon2.verify(
      hash,
      password
    );
  }

}