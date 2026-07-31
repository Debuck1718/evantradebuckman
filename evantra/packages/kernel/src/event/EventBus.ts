import { Event } from "./Event";
import { EventContext } from "./EventContext";
import { EventSubscriber } from "./EventSubscriber";

export class EventBus {
  private readonly events: Event[] = [];

  private readonly subscribers: EventSubscriber[] = [];

  /**
   * Publish an event.
   *
   * Stores the event in history and dispatches it
   * to every matching subscriber.
   */
  async publish(event: Event): Promise<void> {
    this.events.push(event);

    const context = new EventContext(event);

    for (const subscriber of this.subscribers) {
      if (!subscriber.supports(event)) {
        continue;
      }

      await subscriber.handle(context);
    }
  }

  /**
   * Register a subscriber.
   */
  subscribe(
    subscriber: EventSubscriber
  ): this {
    this.subscribers.push(subscriber);

    return this;
  }

  /**
   * Remove a subscriber.
   */
  unsubscribe(
    subscriber: EventSubscriber
  ): boolean {
    const index =
      this.subscribers.indexOf(subscriber);

    if (index === -1) {
      return false;
    }

    this.subscribers.splice(index, 1);

    return true;
  }

  /**
   * Complete event history.
   */
  history(): readonly Event[] {
    return [...this.events];
  }

  /**
   * Most recently published event.
   */
  latest(): Event | undefined {
    return this.events.at(-1);
  }

  /**
   * Registered subscribers.
   */
  subscribersList(): readonly EventSubscriber[] {
    return [...this.subscribers];
  }

  /**
   * Number of published events.
   */
  count(): number {
    return this.events.length;
  }

  /**
   * Number of registered subscribers.
   */
  subscriberCount(): number {
    return this.subscribers.length;
  }

  /**
   * True if no events exist.
   */
  isEmpty(): boolean {
    return this.events.length === 0;
  }

  /**
   * Clears only event history.
   * Subscribers remain registered.
   */
  clearHistory(): void {
    this.events.length = 0;
  }

  /**
   * Removes every subscriber.
   */
  clearSubscribers(): void {
    this.subscribers.length = 0;
  }

  /**
   * Reset the bus completely.
   */
  clear(): void {
    this.clearHistory();
    this.clearSubscribers();
  }
}