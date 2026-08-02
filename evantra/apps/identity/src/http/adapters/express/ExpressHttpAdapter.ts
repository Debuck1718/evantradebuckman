import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ParsedQs,
} from "qs";

import {
  HttpController,
  HttpRequest,
} from "../../";

import type {
  HttpResponse,
} from "../../";

import {
  ExpressCookieWriter,
} from "./ExpressCookieWriter";

/**
 * Adapts Express requests and
 * responses to Evantra's HTTP
 * abstractions.
 *
 * This class isolates the
 * application layer from the
 * Express framework.
 */
export class ExpressHttpAdapter {

  /**
   * Creates an Express request
   * handler for a controller.
   */
  static adapt(
    controller: HttpController,
  ): (

    request: Request,

    response: Response,

    next: NextFunction,

  ) => Promise<void> {

    return async (

      request,

      response,

      next,

    ): Promise<void> => {

      try {

        const httpRequest =
          this.toHttpRequest(
            request,
          );

        const httpResponse =
          await controller.handle(
            httpRequest,
          );

        this.writeResponse(

          response,

          httpResponse,

        );

      }

      catch (

        error

      ) {

        next(error);

      }

    };

  }

  /**
   * Converts an Express Request
   * into an Evantra HttpRequest.
   */
  private static toHttpRequest(
    request: Request,
  ): HttpRequest {

    return {

      params:

        this.normalizeParams(

          request.params,

        ),

      query:

        this.normalizeQuery(

          request.query,

        ),

      headers:

        this.normalizeHeaders(

          request.headers,

        ),

      cookies:

        this.normalizeCookies(

          request.cookies,

        ),

      body:

        request.body,

      ipAddress:

        request.ip || "0.0.0.0",

    };

  }

  /**
   * Writes an Evantra
   * HttpResponse to Express.
   */
  private static writeResponse(

    response: Response,

    httpResponse: HttpResponse,

  ): void {

    // ======================================================
    // Headers
    // ======================================================

    for (

      const [

        name,

        value,

      ] of Object.entries(

        httpResponse.headers,

      )

    ) {

      response.setHeader(

        name,

        value,

      );

    }

    // ======================================================
    // Cookies
    // ======================================================

    ExpressCookieWriter.write(

      response,

      httpResponse.cookies,

    );

    // ======================================================
    // Response
    // ======================================================

    response.status(

      httpResponse.status,

    );

    response.json(

      httpResponse.body,

    );

  }

  /**
   * Normalizes Express route
   * parameters into strings.
   */
  private static normalizeParams(

    params: Request["params"],

  ): Record<string, string> {

    return Object.fromEntries(

      Object.entries(

        params,

      ).map(

        ([

          key,

          value,

        ]) => [

          key,

          String(value),

        ],

      ),

    );

  }

  /**
   * Normalizes Express query
   * parameters into strings.
   */
  private static normalizeQuery(

    query: ParsedQs,

  ): Record<string, string> {

    const normalized:
      Record<string, string> = {};

    for (

      const [

        key,

        value,

      ] of Object.entries(

        query,

      )

    ) {

      if (

        typeof value ===
        "string"

      ) {

        normalized[key] =
          value;

      }

      else if (

        Array.isArray(

          value,

        )

      ) {

        const first =
          value[0];

        if (

          typeof first ===
          "string"

        ) {

          normalized[key] =
            first;

        }

      }

    }

    return normalized;

  }

  /**
   * Normalizes Express
   * request headers.
   */
  private static normalizeHeaders(

    headers: Request["headers"],

  ): Record<string, string> {

    const normalized:
      Record<string, string> = {};

    for (

      const [

        key,

        value,

      ] of Object.entries(

        headers,

      )

    ) {

      if (

        typeof value ===
        "string"

      ) {

        normalized[key] =
          value;

      }

      else if (

        Array.isArray(

          value,

        )

      ) {

        normalized[key] =
          value.join(

            ", ",

          );

      }

    }

    return normalized;

  }

  /**
   * Normalizes Express
   * cookies into strings.
   */
  private static normalizeCookies(

    cookies:
      Record<string, unknown> |
      undefined,

  ): Record<string, string> {

    const normalized:
      Record<string, string> = {};

    if (

      !cookies

    ) {

      return normalized;

    }

    for (

      const [

        key,

        value,

      ] of Object.entries(

        cookies,

      )

    ) {

      if (

        typeof value ===
        "string"

      ) {

        normalized[key] =
          value;

      }

    }

    return normalized;

  }

}