import { Event } from "./Event";

export class EventContext<T extends Event = Event> {
  /**
   * Event being processed.
   */
  public readonly event: T;

  /**
   * Time the event entered the bus.
   */
  public readonly publishedAt: Date;

  /**
   * Shared metadata.
   */
  public readonly metadata = new Map<string, unknown>();

  constructor(event: T) {
    this.event = event;
    this.publishedAt = new Date();
  }

  elapsed(): number {
    return Date.now() - this.publishedAt.getTime();
  }

  set(key: string, value: unknown): void {
    this.metadata.set(key, value);
  }

  get<TValue = unknown>(key: string): TValue | undefined {
    return this.metadata.get(key) as TValue | undefined;
  }

  has(key: string): boolean {
    return this.metadata.has(key);
  }

  delete(key: string): boolean {
    return this.metadata.delete(key);
  }

  clear(): void {
    this.metadata.clear();
  }
}