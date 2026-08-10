/**
 * Boot step callback.
 */
export type BootStep = () => Promise<void> | void;

/**
 * Runs ordered boot steps.
 */
export class BootManager {
	private readonly steps: BootStep[] = [];

	register(step: BootStep): void {
		this.steps.push(step);
	}

	async run(): Promise<void> {
		for (const step of this.steps) {
			await step();
		}
	}

	clear(): void {
		this.steps.length = 0;
	}

	count(): number {
		return this.steps.length;
	}
}
