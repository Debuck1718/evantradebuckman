/**
 * A role groups multiple
 * permissions together.
 */
export interface Role {
  /**
   * Role identifier.
   */
  id: string;

  /**
   * Role name.
   */
  name: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Assigned permissions.
   */
  permissionIds: readonly string[];
}