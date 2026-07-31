export interface TransitionRecord {
  entityId: string;

  machine: string;

  action: string;

  previousState: string;

  currentState: string;

  timestamp: Date;
}