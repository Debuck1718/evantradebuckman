import "dotenv/config";

import { Pool } from "pg";

import { PlatformFactory } from "./PlatformFactory";
import { RepositoryFactory } from "./RepositoryFactory";
import { ServiceFactory } from "./ServiceFactory";
import { WorkflowFactory } from "./WorkflowFactory";
import { HttpFactory } from "./HttpFactory";

/**
 * Creates the complete
 * Evantra Identity application.
 *
 * This is the application's
 * composition root.
 */
export class ApplicationFactory {

  static async create() {

    // ==========================================================
    // Environment Validation
    // ==========================================================

    if (!process.env.DATABASE_URL) {

      throw new Error(
        "DATABASE_URL environment variable is missing.",
      );

    }

    // ==========================================================
    // PostgreSQL
    // ==========================================================

    const database =
      new Pool({

        connectionString:
          process.env.DATABASE_URL,

        max: 20,

        idleTimeoutMillis:
          30000,

        connectionTimeoutMillis:
          5000,

      });

    //
    // Verify connectivity early.
    //
    await database.query(
      "SELECT 1",
    );

    // ==========================================================
    // Platform
    // ==========================================================

    const platform =
      PlatformFactory.create();

    // ==========================================================
    // Repositories
    // ==========================================================

    const repositories =
      RepositoryFactory.create(

        database,

      );

    // ==========================================================
    // Domain Services
    // ==========================================================

    const services =
      ServiceFactory.create(

        repositories,

        platform,

      );

    // ==========================================================
    // Workflows
    // ==========================================================

    const workflows =
      WorkflowFactory.create(

        services,

        platform,

      );

    // ==========================================================
    // HTTP
    // ==========================================================

    const http =
      HttpFactory.create(

        workflows,

        platform,

      );

    // ==========================================================
    // Shutdown
    // ==========================================================

    async function shutdown() {

      await database.end();

    }

    // ==========================================================
    // Registry
    // ==========================================================

    return {

      name:
        "Evantra Identity",

      version:
        "1.0.0",

      database,

      platform,

      repositories,

      services,

      workflows,

      http,

      shutdown,

    };

  }

}