import { Recovery } from "./Recovery";
import { RecoveryRepository } from "./RecoveryRepository";

import { Clock } from "../platform/Clock";
import { IdGenerator } from "../platform/IdGenerator";
import { TokenGenerator } from "../platform/TokenGenerator";

/**
 * Coordinates password
 * recovery requests.
 */
export class RecoveryService {

  constructor(
    private readonly repository: RecoveryRepository,
    private readonly ids: IdGenerator,
    private readonly tokens: TokenGenerator,
    private readonly clock: Clock
  ) {}

  /**
   * Creates a recovery request.
   */
  async create(
    accountId: string
  ): Promise<Recovery> {

    const recovery =
      Recovery.create({

        id:
          this.ids.recovery(),

        accountId,

        token:
          this.tokens.recovery(),

        expiresAt:
          this.clock.afterMinutes(30),
      });

    await this.repository.create(
      recovery
    );

    return recovery;
  }

  /**
   * Finds a recovery request
   * using its token.
   */
  async findByToken(
    token: string
  ): Promise<Recovery | null> {

    return this.repository.findByToken(
      token
    );
  }

  /**
   * Marks a recovery request
   * as used.
   */
  async use(
    recovery: Recovery
  ): Promise<void> {

    recovery.use();

    await this.repository.update(
      recovery
    );
  }

  /**
   * Deletes a recovery request.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.repository.delete(
      id
    );
  }
}