import {

  Router,

} from "express";

import {

  ExpressHttpAdapter,

} from "./ExpressHttpAdapter";

import {

  AuthenticateController,

} from "../../../authentication/controllers/AuthenticateController";

/**
 * Registers
 * Evantra routes.
 */
export class ExpressRouter {

  static create(

    authenticate:

      AuthenticateController,

  ): Router {

    const router =

      Router();

    router.post(

      "/login",

      ExpressHttpAdapter.adapt(

        authenticate,

      ),

    );

    return router;

  }

}