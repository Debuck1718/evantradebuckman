import { ZodSchema } from "zod";

import { InvalidRequestError } from "../../../domain/errors/InvalidRequestError";

export function validate<T>(
  schema: ZodSchema<T>,
  body: unknown,
): T {

  const result =
    schema.safeParse(
      body,
    );

  if (!result.success) {

    throw new InvalidRequestError(

      result.error.issues[0]?.message ??
      "Invalid request.",

    );

  }

  return result.data;

}