import { Application } from "./Application";
import { ApplicationContext } from "./ApplicationContext";
import { ApplicationRegistry } from "./ApplicationRegistry";
import { ApplicationStatus } from "./ApplicationStatus";

/**
 * Manages the lifecycle of every
 * application registered with
 * the Evantra Kernel.
 *
 * The manager is responsible for:
 * - Registration
 * - Startup
 * - Shutdown
 * - Restart
 * - Runtime status
 */
export class ApplicationManager {
  /**
   * Runtime status for every
   * registered application.
   */
  private readonly statuses =
    new Map<string, ApplicationStatus>();

  constructor(
    private readonly registry: ApplicationRegistry,
    private readonly context: ApplicationContext
  ) {}

  /**
   * Registers an application.
   */
  register(
    application: Application
  ): void {

    this.registry.register(application);

    this.statuses.set(
      application.id,
      ApplicationStatus.REGISTERED
    );
  }

  /**
   * Unregisters an application.
   */
  async unregister(
    id: string
  ): Promise<boolean> {

    if (!this.registry.has(id)) {
      return false;
    }

    if (this.isRunning(id)) {
      await this.stop(id);
    }

    this.statuses.delete(id);

    return this.registry.remove(id);
  }

  /**
   * Starts an application.
   */
  async start(
    id: string
  ): Promise<void> {

    const application =
      this.registry.get(id);

    if (!application) {
      throw new Error(
        `Application '${id}' not found.`
      );
    }

    if (!application.enabled) {
      throw new Error(
        `Application '${id}' is disabled.`
      );
    }

    if (this.isRunning(id)) {
      return;
    }

    this.statuses.set(
      id,
      ApplicationStatus.INITIALIZING
    );

    try {

      await application.initialize(
        this.context
      );

      this.statuses.set(
        id,
        ApplicationStatus.RUNNING
      );

    } catch (error) {

      this.statuses.set(
        id,
        ApplicationStatus.FAILED
      );

      throw error;
    }
  }

  /**
   * Stops an application.
   */
  async stop(
    id: string
  ): Promise<void> {

    const application =
      this.registry.get(id);

    if (!application) {
      throw new Error(
        `Application '${id}' not found.`
      );
    }

    if (!this.isRunning(id)) {
      return;
    }

    this.statuses.set(
      id,
      ApplicationStatus.STOPPING
    );

    try {

      await application.shutdown(
        this.context
      );

    } finally {

      this.statuses.set(
        id,
        ApplicationStatus.STOPPED
      );

    }
  }

  /**
   * Restarts an application.
   */
  async restart(
    id: string
  ): Promise<void> {

    await this.stop(id);

    await this.start(id);
  }

  /**
   * Starts every enabled
   * application.
   */
  async startAll(): Promise<void> {

    for (const application of this.registry.all()) {

      if (!application.enabled) {
        continue;
      }

      await this.start(
        application.id
      );
    }
  }

  /**
   * Stops every running
   * application.
   */
  async stopAll(): Promise<void> {

    for (const application of this.running()) {

      await this.stop(
        application.id
      );
    }
  }

  /**
   * Returns an application.
   */
  get(
    id: string
  ): Application | undefined {
    return this.registry.get(id);
  }

  /**
   * Returns every registered
   * application.
   */
  all(): readonly Application[] {
    return this.registry.all();
  }

  /**
   * Returns every running
   * application.
   */
  running(): readonly Application[] {

    return this.registry
      .all()
      .filter(application =>
        this.isRunning(
          application.id
        )
      );
  }

  /**
   * Returns true if the
   * application is registered.
   */
  isRegistered(
    id: string
  ): boolean {
    return this.registry.has(id);
  }

  /**
   * Returns true if the
   * application is running.
   */
  isRunning(
    id: string
  ): boolean {

    return (
      this.status(id) ===
      ApplicationStatus.RUNNING
    );
  }

  /**
   * Returns the current
   * application status.
   */
  status(
    id: string
  ): ApplicationStatus | undefined {

    return this.statuses.get(id);
  }

  /**
   * Number of registered
   * applications.
   */
  count(): number {
    return this.registry.count();
  }

  /**
   * Returns true if no
   * applications are registered.
   */
  isEmpty(): boolean {
    return this.registry.isEmpty();
  }
}