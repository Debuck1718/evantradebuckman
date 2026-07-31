import { Application } from "./Application";

/**
 * Stores every application
 * registered with the
 * Evantra Kernel.
 *
 * The registry is responsible
 * only for storing and retrieving
 * applications.
 *
 * Application lifecycle is managed
 * by the ApplicationManager.
 */
export class ApplicationRegistry {
  /**
   * Registered applications.
   *
   * Key = Application ID
   */
  private readonly applications =
    new Map<string, Application>();

  /**
   * Registers an application.
   */
  register(
    application: Application
  ): void {

    if (this.applications.has(application.id)) {
      throw new Error(
        `Application '${application.id}' is already registered.`
      );
    }

    this.applications.set(
      application.id,
      application
    );
  }

  /**
   * Returns an application.
   */
  get(
    id: string
  ): Application | undefined {
    return this.applications.get(id);
  }

  /**
   * Returns true if the
   * application exists.
   */
  has(
    id: string
  ): boolean {
    return this.applications.has(id);
  }

  /**
   * Returns every registered
   * application.
   */
  all(): readonly Application[] {
    return Array.from(
      this.applications.values()
    );
  }

  /**
   * Removes an application.
   */
  remove(
    id: string
  ): boolean {
    return this.applications.delete(id);
  }

  /**
   * Removes every application.
   *
   * Mainly useful during testing.
   */
  clear(): void {
    this.applications.clear();
  }

  /**
   * Number of registered
   * applications.
   */
  count(): number {
    return this.applications.size;
  }

  /**
   * Returns true if no
   * applications are registered.
   */
  isEmpty(): boolean {
    return this.applications.size === 0;
  }
}