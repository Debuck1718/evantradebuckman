import { Event } from "../event/Event";

/**
 * Published whenever an entity
 * changes workflow state.
 */
export interface StateTransitionEvent extends Event {
  type: "StateTransitioned";

  entityId: string;

  machine: string;

  previousState: string;

  currentState: string;

  action: string;

  timestamp: Date;
}