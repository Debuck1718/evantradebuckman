import { configureExpress } from "./http/server/configureExpress";
import { ExpressServer } from "./http/server/ExpressServer";

async function bootstrap() {

  const app =
    configureExpress();

  const server =
    new ExpressServer(

      app,

      Number(
        process.env.PORT ?? 3000,
      ),

    );

  await server.start();

}

bootstrap().catch(

  error => {

    console.error(error);

    process.exit(1);

  },

);