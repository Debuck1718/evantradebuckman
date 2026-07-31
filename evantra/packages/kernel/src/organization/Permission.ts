/**
 * A permission grants
 * access to a capability.
 */
export interface Permission {
  /**
   * Permission identifier.
   */
  id: string;

  /**
   * Unique permission key.
   *
   * Example:
   * store.products.create
   */
  key: string;

  /**
   * Human-readable name.
   */
  name: string;

  /**
   * Optional description.
   */
  description?: string;
}