import { Event } from "./Event";
import { EventContext } from "./EventContext";

export interface EventSubscriber<
  T extends Event = Event
> {
  supports(event: Event): boolean;

  handle(
    context: EventContext<T>
  ): void | Promise<void>;
}