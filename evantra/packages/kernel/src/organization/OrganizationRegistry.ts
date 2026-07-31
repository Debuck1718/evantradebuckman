import { Organization } from "./Organization";

/**
 * Stores every organization
 * registered with the
 * Evantra Platform.
 *
 * The registry is responsible
 * only for storage and lookup.
 *
 * Organization lifecycle
 * operations are handled by
 * OrganizationManager.
 */
export class OrganizationRegistry {
  /**
   * Registered organizations.
   */
  private readonly organizations =
    new Map<string, Organization>();

  /**
   * Registers an organization.
   */
  register(
    organization: Organization
  ): void {

    if (
      this.organizations.has(
        organization.id
      )
    ) {
      throw new Error(
        `Organization '${organization.id}' is already registered.`
      );
    }

    this.organizations.set(
      organization.id,
      organization
    );
  }

  /**
   * Returns an organization.
   */
  get(
    id: string
  ): Organization | undefined {
    return this.organizations.get(id);
  }

  /**
   * Finds an organization
   * by slug.
   */
  findBySlug(
    slug: string
  ): Organization | undefined {

    return this.all().find(
      organization =>
        organization.slug.toLowerCase() ===
        slug.toLowerCase()
    );
  }

  /**
   * Returns every organization.
   */
  all(): readonly Organization[] {
    return [
      ...this.organizations.values(),
    ];
  }

  /**
   * Returns true if the
   * organization exists.
   */
  has(
    id: string
  ): boolean {
    return this.organizations.has(id);
  }

  /**
   * Removes an organization.
   */
  remove(
    id: string
  ): boolean {
    return this.organizations.delete(id);
  }

  /**
   * Removes every organization.
   */
  clear(): void {
    this.organizations.clear();
  }

  /**
   * Number of organizations.
   */
  count(): number {
    return this.organizations.size;
  }

  /**
   * Returns true if the
   * registry is empty.
   */
  isEmpty(): boolean {
    return this.organizations.size === 0;
  }
}