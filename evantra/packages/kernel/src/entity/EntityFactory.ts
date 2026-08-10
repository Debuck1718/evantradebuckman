import { createId } from "../utils/createId";

interface EntityLifecycle {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Creates entities with consistent
 * kernel lifecycle metadata.
 */
export class EntityFactory {
	create<T extends Record<string, unknown>>(
		payload: T,
	): T & EntityLifecycle {
		const now = new Date();

		return {
			...payload,
			id: createId(),
			createdAt: now,
			updatedAt: now,
		};
	}
}
