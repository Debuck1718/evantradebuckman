import { Verification } from "./Verification";
import { VerificationRepository } from "./VerificationRepository";

/**
 * Coordinates account verification
 * requests.
 */
export class VerificationService {

  constructor(
    private readonly repository: VerificationRepository
  ) {}

  /**
   * Creates a verification request.
   */
  async create(params: {
    id: string;
    accountId: string;
    token: string;
    expiresAt: Date;
  }): Promise<Verification> {

    const verification =
      Verification.create({
        id: params.id,
        accountId: params.accountId,
        token: params.token,
        expiresAt: params.expiresAt,
      });

    await this.repository.create(
      verification
    );

    return verification;
  }

  /**
   * Finds a verification request
   * using its token.
   */
  async findByToken(
    token: string
  ): Promise<Verification | null> {

    return this.repository.findByToken(
      token
    );
  }

  /**
   * Marks a verification request
   * as verified.
   */
  async verify(
    verification: Verification
  ): Promise<void> {

    verification.verify();

    await this.repository.update(
      verification
    );
  }

  async findByAccountId(
  accountId: string,
): Promise<Verification | null> {

  return this.repository.findByAccountId(
    accountId,
  );

}

  /**
   * Deletes a verification request.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.repository.delete(
      id
    );
  }
}