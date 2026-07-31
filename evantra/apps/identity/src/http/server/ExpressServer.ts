import { Express } from "express";
import { Server } from "http";

export class ExpressServer {

  private server?: Server;

  constructor(

    private readonly app: Express,

    private readonly port: number,

  ) {}

  /**
   * Starts the HTTP server.
   */
  start(): Promise<void> {

    return new Promise(

      resolve => {

        this.server =
          this.app.listen(

            this.port,

            () => {

              console.log(

                `🚀 Evantra Identity listening on port ${this.port}`,

              );

              resolve();

            },

          );

      },

    );

  }

  /**
   * Stops the HTTP server.
   */
  stop(): Promise<void> {

    return new Promise(

      (resolve, reject) => {

        if (!this.server) {

          resolve();

          return;

        }

        this.server.close(

          error => {

            if (error) {

              reject(error);

              return;

            }

            resolve();

          },

        );

      },

    );

  }

}