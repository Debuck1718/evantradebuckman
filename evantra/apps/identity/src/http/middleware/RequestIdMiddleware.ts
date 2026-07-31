import {
  NextFunction,
  Request,
  Response,
} from "express";

import { v4 as uuid } from "uuid";

declare module "express-serve-static-core" {

  interface Request {

    requestId: string;

  }

}

/**
 * Assigns a unique request ID.
 */
export function RequestIdMiddleware(

  request: Request,

  response: Response,

  next: NextFunction,

): void {

  const requestId =
    uuid();

  request.requestId =
    requestId;

  response.setHeader(
    "X-Request-ID",
    requestId,
  );

  next();

}