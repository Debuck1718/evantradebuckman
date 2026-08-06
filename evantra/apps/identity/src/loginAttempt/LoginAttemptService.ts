import { LoginAttempt } from "./LoginAttempt";
import { LoginAttemptRepository } from "./LoginAttemptRepository";

export class LoginAttemptService {

  constructor(

    private readonly repository:
      LoginAttemptRepository,

  ) {}

  async findByEvantraId(
    evantraId: string,
  ): Promise<LoginAttempt | null> {

    return this.repository.findByEvantraId(
      evantraId,
    );

  }

  async save(
    attempt: LoginAttempt,
  ): Promise<void> {

    const existing =
      await this.repository.findByEvantraId(
        attempt.evantraId,
      );

    if (existing) {

      await this.repository.update(
        attempt,
      );

      return;

    }

    await this.repository.create(
      attempt,
    );

  }

  async delete(
    evantraId: string,
  ): Promise<void> {

    await this.repository.delete(
      evantraId,
    );

  }

}