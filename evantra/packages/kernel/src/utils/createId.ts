/**
 * Generates a unique identifier.
 *
 * Uses the Web Crypto API when available and
 * falls back to a timestamp-based identifier.
 */
export function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
  ].join("-");
}