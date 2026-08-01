import "dotenv/config";

import { ApplicationFactory } from "../factory/ApplicationFactory";

import { configureExpress } from "../http/server/configureExpress";

import { ExpressServer } from "../http/server/ExpressServer";

/**
 * Bootstraps Evantra Identity.
 */
async function bootstrap(): Promise<void> {

  // ==========================================================
  // Build Application
  // ==========================================================

  const application =
    await ApplicationFactory.create();

  // ==========================================================
  // Configure Express
  // ==========================================================

  const app =
    configureExpress(

      application.http,

    );

  // ==========================================================
  // HTTP Server
  // ==========================================================

  const server =
    new ExpressServer(

      app,

      Number(
        process.env.PORT ?? 3000,
      ),

    );

  // ==========================================================
  // Start
  // ==========================================================

  await server.start();

  console.info("");

  console.info(
    "========================================",
  );

  console.info(
    `${application.name} ${application.version}`,
  );

  console.info(
    `Environment : ${process.env.NODE_ENV ?? "development"}`,
  );

  console.info(
    `Port        : ${process.env.PORT ?? 3000}`,
  );

  console.info(
    "========================================",
  );

  console.info("");

  // ==========================================================
  // Graceful Shutdown
  // ==========================================================

  const shutdown = async (
    signal: string,
  ): Promise<void> => {

    console.info(
      `Received ${signal}. Shutting down...`,
    );

    try {

      await server.stop();

      await application.shutdown();

      console.info(
        "Database disconnected.",
      );

      process.exit(0);

    }

    catch (error) {

      console.error(
        "Shutdown failed.",
        error,
      );

      process.exit(1);

    }

  };

  process.on(
    "SIGINT",
    () => void shutdown("SIGINT"),
  );

  process.on(
    "SIGTERM",
    () => void shutdown("SIGTERM"),
  );

}

bootstrap().catch(

  (error) => {

    console.error(
      "Application failed to start.",
      error,
    );

    process.exit(1);

  },

);