import { State } from "./State";
import { StateTransition } from "./StateTransition";

/**
 * Configuration used to build a state machine.
 */
export interface StateMachineOptions<
  TState extends string
> {
  /**
   * Machine name.
   */
  name: string;

  /**
   * Initial state.
   */
  initial: TState;

  /**
   * Available states.
   */
  states: readonly State[];

  /**
   * Allowed transitions.
   */
  transitions: readonly StateTransition<TState>[];
}

/**
 * Immutable state machine definition.
 *
 * A StateMachine never stores the current state.
 * The current state always belongs to an entity.
 */
export class StateMachine<
  TState extends string = string
> {
  constructor(
    private readonly options: StateMachineOptions<TState>
  ) {}

  /**
   * Machine name.
   */
  get name(): string {
    return this.options.name;
  }

  /**
   * Initial state.
   */
  get initial(): TState {
    return this.options.initial;
  }

  /**
   * Registered states.
   */
  states(): readonly State[] {
    return this.options.states;
  }

  /**
   * Registered transitions.
   */
  transitions(): readonly StateTransition<TState>[] {
    return this.options.transitions;
  }

  /**
   * Returns true if an action is valid
   * from the supplied state.
   */
  can(
    current: TState,
    action: string
  ): boolean {
    return this.options.transitions.some(
      transition =>
        transition.from === current &&
        transition.action === action
    );
  }

  /**
   * Returns every available action
   * from the supplied state.
   */
  actions(
    current: TState
  ): readonly string[] {
    return this.options.transitions
      .filter(
        transition =>
          transition.from === current
      )
      .map(
        transition => transition.action
      );
  }

  /**
   * Returns every possible destination
   * from the supplied state.
   */
  nextStates(
    current: TState
  ): readonly TState[] {
    return this.options.transitions
      .filter(
        transition =>
          transition.from === current
      )
      .map(
        transition => transition.to
      );
  }

  /**
   * Executes a transition.
   *
   * Returns the new state.
   */
  transition(
    current: TState,
    action: string
  ): TState {
    const transition =
      this.options.transitions.find(
        transition =>
          transition.from === current &&
          transition.action === action
      );

    if (!transition) {
      throw new Error(
        `Action '${action}' cannot be performed from state '${current}'.`
      );
    }

    return transition.to;
  }

  /**
   * Returns true if the supplied state
   * is the initial state.
   */
  isInitial(
    state: TState
  ): boolean {
    return state === this.options.initial;
  }

  /**
   * Returns true if the supplied state
   * is terminal.
   */
  isFinal(
    state: TState
  ): boolean {
    const definition =
      this.options.states.find(
        s => s.name === state
      );

    return definition?.final ?? false;
  }
}