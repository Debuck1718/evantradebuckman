import pinoHttp from "pino-http";

/**
 * HTTP request logger.
 */
export const LoggingMiddleware =
  pinoHttp({

    autoLogging: true,

  });