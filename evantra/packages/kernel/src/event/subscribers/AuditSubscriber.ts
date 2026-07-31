import { Event } from "../Event";
import { EventContext } from "../EventContext";
import { EventSubscriber } from "../EventSubscriber";

export class AuditSubscriber
  implements EventSubscriber<Event>
{
  supports(event: Event): event is Event {
    return true;
  }

  async handle(
    context: EventContext<Event>
  ): Promise<void> {
    console.log(`📝 AUDIT ${context.event.type}`);
  }
}