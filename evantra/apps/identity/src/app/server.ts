import "dotenv/config";

import {
  Application,
} from "../bootstrap/Application";

import {
  ExpressServer,
} from "../http/adapters/express";

/**
 * Bootstraps Evantra Identity.
 */

const application =
  Application.create();

const app =
  ExpressServer.create(

    application,

  );

const PORT =
  Number(

    process.env.PORT ?? 3000,

  );

app.listen(

  PORT,

  () => {

    console.info("");

    console.info("====================================");

    console.info(" Evantra Identity");

    console.info(` Port : ${PORT}`);

    console.info("====================================");

    console.info("");

  },

);