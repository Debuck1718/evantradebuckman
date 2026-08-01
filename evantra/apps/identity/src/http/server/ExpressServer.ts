import { Express } from "express";
import { Server } from "http";

/**
 * Wraps the Node.js HTTP server.
 *
 * Responsible for:
 * - Starting Express
 * - Graceful shutdown
 * - Connection timeouts
 */
export class ExpressServer {

  private server: Server | null =
    null;

  constructor(

    private readonly app: Express,

    private readonly port: number,

  ) {}

  /**
   * Starts the HTTP server.
   */
  async start(): Promise<void> {

    if (this.server) {

      return;

    }

    await new Promise<void>(

      (resolve, reject) => {

        const server =
          this.app.listen(

            this.port,

            () => {

              this.server =
                server;

              //
              // Production timeouts
              //
              server.requestTimeout =
                30_000;

              server.headersTimeout =
                35_000;

              server.keepAliveTimeout =
                5_000;

              console.info(
                `🚀 Evantra Identity listening on port ${this.port}`,
              );

              resolve();

            },

          );

        server.on(

          "error",

          reject,

        );

      },

    );

  }

  /**
   * Stops accepting new
   * connections and waits
   * for existing requests
   * to finish.
   */
  async stop(): Promise<void> {

    if (!this.server) {

      return;

    }

    const server =
      this.server;

    this.server =
      null;

    await new Promise<void>(

      (resolve, reject) => {

        server.close(

          error => {

            if (error) {

              reject(error);

              return;

            }

            console.info(
              "HTTP server stopped.",
            );

            resolve();

          },

        );

      },

    );

  }

  /**
   * Returns true when
   * the server is running.
   */
  isRunning(): boolean {

    return this.server !== null;

  }

}