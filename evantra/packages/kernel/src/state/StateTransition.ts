/**
 * Represents a transition between two states
 * within a state machine.
 */
export interface StateTransition<
  TState extends string = string
> {
  /**
   * Source state.
   */
  from: TState;

  /**
   * Destination state.
   */
  to: TState;

  /**
   * Action that triggers the transition.
   *
   * Example:
   *  pay
   *  approve
   *  submit
   *  cancel
   */
  action: string;

  /**
   * Optional human-readable description.
   */
  description?: string;

  /**
   * Additional metadata.
   *
   * Reserved for future features such as:
   * - permissions
   * - audit data
   * - UI labels
   * - icons
   * - business rules
   */
  metadata?: Record<string, unknown>;
}