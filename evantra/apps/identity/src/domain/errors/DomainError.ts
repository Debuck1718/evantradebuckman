/**
 * Base exception for all
 * domain-level errors.
 *
 * Domain errors are independent
 * of HTTP and can be translated
 * by the HTTP layer into the
 * appropriate response.
 */
export abstract class DomainError extends Error {

  protected constructor(

    message: string,

  ) {

    super(message);

    this.name =
      new.target.name;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );

  }

}