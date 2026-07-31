/**
 * Represents a workflow state.
 */
export interface State {
  /**
   * Unique state identifier.
   */
  name: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Marks the initial state.
   */
  initial?: boolean;

  /**
   * Marks a terminal state.
   */
  final?: boolean;
}