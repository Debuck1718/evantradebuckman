/**
 * Base class for every
 * Browser Session error.
 */
export abstract class SessionError
  extends Error {

  constructor(

    /**
     * Machine-readable
     * Session error code.
     */
    public readonly error: string,

    /**
     * Human-readable
     * description.
     */
    public readonly description: string,

  ) {

    super(description);

  }

}