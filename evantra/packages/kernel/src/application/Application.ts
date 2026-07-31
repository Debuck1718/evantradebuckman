import { ApplicationContext } from "./ApplicationContext";

/**
 * Represents an application that
 * participates in the Evantra ecosystem.
 *
 * Applications are independent products
 * (StoreForge, SmartStudent, Livo, etc.)
 * that integrate with the Evantra Kernel.
 */
export interface Application {
  /**
   * Unique application identifier.
   *
   * Examples:
   * storeforge
   * smartstudent
   * livo
   */
  readonly id: string;

  /**
   * Human-readable application name.
   */
  readonly name: string;

  /**
   * Current application version.
   */
  readonly version: string;

  /**
   * Route or URL used by the
   * Evantra dashboard.
   *
   * Examples:
   * /storeforge
   * https://storeforge.evantra.com
   */
  readonly route: string;

  /**
   * Determines whether the
   * application can be started.
   */
  readonly enabled: boolean;

  /**
   * Invoked when the application
   * is started by the Kernel.
   */
  initialize(
    context: ApplicationContext
  ): Promise<void>;

  /**
   * Invoked before the application
   * is stopped by the Kernel.
   */
  shutdown(
    context: ApplicationContext
  ): Promise<void>;
}