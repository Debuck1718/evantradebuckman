import {
  postgres,
} from "../../infrastructure/database";

import {
  RepositoryFactory,
} from "../factory/RepositoryFactory";

import {
  PlatformFactory,
} from "../factory/PlatformFactory";

import {
  ServiceFactory,
} from "../factory/ServiceFactory";

import {
  WorkflowFactory,
} from "../factory/WorkflowFactory";

import {
  ControllerFactory,
} from "./ControllerFactory";

import {
  HttpFactory,
} from "../factory/HttpFactory";

type RepositoryRegistry =
  ReturnType<typeof RepositoryFactory.create>;

type PlatformRegistry =
  ReturnType<typeof PlatformFactory.create>;

type ServiceRegistry =
  ReturnType<typeof ServiceFactory.create>;

type WorkflowRegistry =
  ReturnType<typeof WorkflowFactory.create>;

type ControllerRegistry =
  ReturnType<typeof ControllerFactory.create>;

type HttpRegistry =
  ReturnType<typeof HttpFactory.create>;

/**
 * Composes the complete
 * Evantra Identity module.
 *
 * This is the composition root
 * of the Identity platform.
 */
export class IdentityModule {

  /**
   * Builds the complete
   * Identity application.
   */
  static create(): {

    repositories: RepositoryRegistry;

    platform: PlatformRegistry;

    services: ServiceRegistry;

    workflows: WorkflowRegistry;

    controllers: ControllerRegistry;

    http: HttpRegistry;

  } {

    // ======================================================
    // Infrastructure
    // ======================================================

    const repositories =
      RepositoryFactory.create(
        postgres,
      );

    // ======================================================
    // Platform Services
    // ======================================================

    const platform =
      PlatformFactory.create();

    // ======================================================
    // Domain Services
    // ======================================================

    const services =
      ServiceFactory.create(
        repositories,
        platform,
      );

    // ======================================================
    // Application Workflows
    // ======================================================

    const workflows =
      WorkflowFactory.create(
        services,
        platform,
      );

    // ======================================================
    // HTTP Controllers
    // ======================================================

    const controllers =
      ControllerFactory.create(
        workflows,
      );

    // ======================================================
    // HTTP Layer
    // ======================================================

    const http =
      HttpFactory.create(
        workflows,
        platform,
      );

    // ======================================================
    // Module Registry
    // ======================================================

    return {

      repositories,

      platform,

      services,

      workflows,

      controllers,

      http,

    };

  }

}