/**
 * Maps persisted enum values
 * back into domain enums.
 *
 * Prevents invalid values from
 * entering the domain model.
 */
export class EnumMapper {

  /**
   * Restores an enum value.
   */
  static restore<T extends Record<string, string>>(
    enumeration: T,
    value: string,
    field: string,
  ): T[keyof T] {

    const values =
      Object.values(
        enumeration,
      );

    if (
      values.includes(
        value as T[keyof T],
      )
    ) {

      return value as T[keyof T];

    }

    throw new Error(

      `Invalid ${field}: ${value}`,

    );

  }

}