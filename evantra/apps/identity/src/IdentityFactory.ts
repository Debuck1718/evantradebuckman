import { Pool } from "pg";

import { IdentityEngine } from "./IdentityEngine";

import {
  RepositoryFactory,
  PlatformFactory,
  ServiceFactory,
  WorkflowFactory,
} from "./factory";

/**
 * Builds a fully configured
 * Evantra Identity Engine.
 *
 * This is the composition root
 * of the Identity application.
 */
export class IdentityFactory {

  /**
   * Creates a fully configured
   * Identity Engine.
   */
  static create(
    db: Pool
  ): IdentityEngine {

    // ==========================================================
    // Infrastructure
    // ==========================================================

    const repositories =
      RepositoryFactory.create(db);

    const platform =
      PlatformFactory.create();

    // ==========================================================
    // Domain Services
    // ==========================================================

    const services =
      ServiceFactory.create(
        repositories,
        platform
      );

    // ==========================================================
    // Workflows
    // ==========================================================

    const workflowGroups =
      WorkflowFactory.create(
        services,
        platform
      );

    const workflows = {
      ...workflowGroups.identity,
      ...workflowGroups.clients,
      ...workflowGroups.oauth,
      ...workflowGroups.session,
    };

    // ==========================================================
    // Identity Engine
    // ==========================================================

    return new IdentityEngine(

      workflows,

      services,

      repositories,

    );

  }

}