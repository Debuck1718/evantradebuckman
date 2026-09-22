import {
  ClientScope,
} from "./ClientScope";

import {
  ClientScopeRepository,
} from "./ClientScopeRepository";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  Clock,
} from "../platform/Clock";

/**
 * Coordinates the scopes an
 * OAuth client may request.
 *
 * Registered scopes form an allow-list. An
 * authorization request that asks for a scope
 * outside this set is rejected, so a client
 * can never escalate beyond what was approved
 * during onboarding.
 */
export class ClientScopeService {

  constructor(

    private readonly repository:
      ClientScopeRepository,

    private readonly ids:
      IdGenerator,

    private readonly clock:
      Clock,

  ) { }

  /**
   * Registers a scope for a client.
   */
  async register(params: {

    clientId: string;

    scope: string;

  }): Promise<ClientScope> {

    const normalized =
      params.scope.trim();

    const existing =
      await this.repository.find(
        params.clientId,
        normalized,
      );

    if (existing) {

      return existing;

    }

    const scope =
      ClientScope.create({

        id:
          this.ids.clientScope(),

        clientId:
          params.clientId,

        scope:
          normalized,

        createdAt:
          this.clock.now(),

      });

    await this.repository.create(scope);

    return scope;

  }

  /**
   * Replaces the registered scope set
   * for a client.
   */
  async replace(params: {

    clientId: string;

    scopes: readonly string[];

  }): Promise<void> {

    const existing =
      await this.repository.findByClientId(
        params.clientId,
      );

    const wanted =
      new Set(
        params.scopes.map(
          (scope) => scope.trim(),
        ),
      );

    for (const scope of existing) {

      if (!wanted.has(scope.scope)) {

        await this.repository.delete(
          scope.id,
        );

      }

    }

    const current =
      new Set(
        existing.map(
          (scope) => scope.scope,
        ),
      );

    for (const scope of wanted) {

      if (!scope || current.has(scope)) {

        continue;

      }

      await this.register({

        clientId:
          params.clientId,

        scope,

      });

    }

  }

  /**
   * Returns every scope registered
   * for a client.
   */
  async list(
    clientId: string,
  ): Promise<ClientScope[]> {

    return this.repository.findByClientId(
      clientId,
    );

  }

  /**
   * Returns the registered scope values
   * for a client.
   */
  async values(
    clientId: string,
  ): Promise<string[]> {

    const scopes =
      await this.repository.findByClientId(
        clientId,
      );

    return scopes.map(
      (scope) => scope.scope,
    );

  }

  /**
   * Returns true when the client is
   * permitted to request the scope.
   */
  async allows(
    clientId: string,
    scope: string,
  ): Promise<boolean> {

    const registered =
      await this.repository.find(
        clientId,
        scope,
      );

    return registered !== null;

  }

  /**
   * Filters a requested scope set down to
   * the scopes the client may actually hold.
   *
   * Used by the authorization endpoint so an
   * over-broad request can never widen access.
   */
  async filterAllowed(params: {

    clientId: string;

    scopes: readonly string[];

  }): Promise<string[]> {

    const allowed =
      new Set(
        await this.values(params.clientId),
      );

    return params.scopes.filter(
      (scope) => allowed.has(scope),
    );

  }

}