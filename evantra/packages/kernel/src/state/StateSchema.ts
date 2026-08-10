import { State } from "./State";
import { StateTransition } from "./StateTransition";

/**
 * Declarative schema for state machines.
 */
export interface StateSchema<TState extends string> {
	name: string;
	initial: TState;
	states: readonly State[];
	transitions: readonly StateTransition<TState>[];
}

/**
 * Validates a state schema before runtime.
 */
export function validateStateSchema<TState extends string>(
	schema: StateSchema<TState>,
): void {
	const available = new Set(schema.states.map(state => state.name));

	if (!available.has(schema.initial)) {
		throw new Error(
			`Initial state '${schema.initial}' is not declared in states list.`,
		);
	}

	for (const transition of schema.transitions) {
		if (!available.has(transition.from)) {
			throw new Error(
				`Transition source state '${transition.from}' is not declared.`,
			);
		}

		if (!available.has(transition.to)) {
			throw new Error(
				`Transition destination state '${transition.to}' is not declared.`,
			);
		}
	}
}
