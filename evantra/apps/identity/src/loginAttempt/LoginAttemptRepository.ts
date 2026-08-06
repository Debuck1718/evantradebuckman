import { LoginAttempt } from "./LoginAttempt";

export interface LoginAttemptRepository {

  create(
    attempt: LoginAttempt,
  ): Promise<void>;

  update(
    attempt: LoginAttempt,
  ): Promise<void>;

  findByEvantraId(
    evantraId: string,
  ): Promise<LoginAttempt | null>;

  delete(
    evantraId: string,
  ): Promise<void>;

}