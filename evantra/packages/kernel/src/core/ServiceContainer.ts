/**
 * ServiceContainer
 *
 * The ServiceContainer is the dependency registry for the Evantra Kernel.
 *
 * Services are registered by their constructor (class) instead of string
 * identifiers, providing compile-time safety and eliminating magic strings.
 *
 * Example:
 *
 * const container = new ServiceContainer();
 *
 * container.register(EventBus, new EventBus());
 *
 * const eventBus = container.resolve(EventBus);
 */
export class ServiceContainer {
  /**
   * Internal service registry.
   */
  private readonly services = new Map<Function, unknown>();

  /**
   * Registers a service.
   *
   * Throws if the service has already been registered.
   */
  register<T>(
    token: new (...args: any[]) => T,
    service: T
  ): void {
    if (this.services.has(token)) {
      throw new Error(
        `Service '${token.name}' is already registered.`
      );
    }

    this.services.set(token, service);
  }

  /**
   * Registers or replaces a service.
   *
   * Useful for:
   * - testing
   * - plugins
   * - custom implementations
   */
  replace<T>(
    token: new (...args: any[]) => T,
    service: T
  ): void {
    this.services.set(token, service);
  }

  /**
   * Resolves a registered service.
   */
  resolve<T>(
    token: new (...args: any[]) => T
  ): T {
    const service = this.services.get(token);

    if (!service) {
      const available =
        this.services.size === 0
          ? "No services are registered."
          : `Available services: ${this.list().join(", ")}`;

      throw new Error(
        `Service '${token.name}' is not registered.\n${available}`
      );
    }

    return service as T;
  }

  /**
   * Returns true if a service exists.
   */
  has<T>(
    token: new (...args: any[]) => T
  ): boolean {
    return this.services.has(token);
  }

  /**
   * Removes a service.
   */
  unregister<T>(
    token: new (...args: any[]) => T
  ): boolean {
    return this.services.delete(token);
  }

  /**
   * Removes every registered service.
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Registers multiple services.
   */
  registerMany(
    services: Array<{
      token: new (...args: any[]) => unknown;
      instance: unknown;
    }>
  ): void {
    for (const service of services) {
      this.register(
        service.token as any,
        service.instance
      );
    }
  }

  /**
   * Returns the names of all registered services.
   */
  list(): readonly string[] {
    return [...this.services.keys()]
      .map(token => token.name)
      .sort();
  }

  /**
   * Number of registered services.
   */
  get size(): number {
    return this.services.size;
  }

  /**
   * Returns true if the container has no services.
   */
  get isEmpty(): boolean {
    return this.services.size === 0;
  }

  /**
   * Returns a serializable representation
   * of the registered services.
   */
  toJSON(): Record<string, string> {
    return Object.fromEntries(
      [...this.services.entries()].map(([token, instance]) => [
        token.name,
        instance?.constructor?.name ?? typeof instance,
      ])
    );
  }
}