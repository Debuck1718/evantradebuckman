import "dotenv/config";

import {
  Application,
} from "../src/bootstrap/Application";

import {
  ExpressServer,
} from "../src/http/adapters/express";

/**
 * Evantra Identity
 * development entry point.
 */

async function main(): Promise<void> {

  // ==========================================================
  // Build Application
  // ==========================================================

  const application =
    Application.create();

  // ==========================================================
  // Build Express
  // ==========================================================

  const app =
    ExpressServer.create(
      application,
    );

  // ==========================================================
  // Configuration
  // ==========================================================

  const port =
    Number(
      process.env.PORT ?? 3000,
    );

  // ==========================================================
  // Start
  // ==========================================================

  app.listen(

    port,

    () => {

      console.log("");

      console.log("======================================");

      console.log(" Evantra Identity");

      console.log("======================================");

      console.log(` Environment : ${process.env.NODE_ENV ?? "development"}`);

      console.log(` Port        : ${port}`);

      console.log("======================================");

      console.log("");

    },

  );

}

main().catch(

  (error) => {

    console.error(

      "Failed to start Evantra Identity.",

      error,

    );

    process.exit(1);

  },

);