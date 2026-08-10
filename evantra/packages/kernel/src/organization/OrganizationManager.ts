import { createId } from "../utils/createId";

import { Membership } from "./Membership";
import { MembershipStatus } from "./MembershipStatus";
import { Organization } from "./Organization";
import { OrganizationProfile } from "./OrganizationProfile";
import { OrganizationRegistry } from "./OrganizationRegistry";
import { OrganizationStatus } from "./OrganizationStatus";
import { Permission } from "./Permission";
import { Role } from "./Role";

interface CreateOrganizationInput {
  id?: string;
  slug: string;
  profile: OrganizationProfile;
}

interface InviteMembershipInput {
  id?: string;
  userId: string;
  organizationId: string;
  roleIds?: readonly string[];
}

/**
 * Manages organization lifecycle,
 * membership, roles, and permission checks.
 */
export class OrganizationManager {
  private readonly memberships =
    new Map<string, Membership>();

  private readonly roles =
    new Map<string, Role>();

  private readonly permissions =
    new Map<string, Permission>();

  constructor(
    private readonly registry: OrganizationRegistry,
  ) {}

  createOrganization(
    input: CreateOrganizationInput,
  ): Organization {
    const slug = input.slug.trim().toLowerCase();

    if (!slug) {
      throw new Error("Organization slug is required.");
    }

    if (this.registry.findBySlug(slug)) {
      throw new Error(
        `Organization slug '${slug}' is already in use.`,
      );
    }

    const now = new Date();

    const organization: Organization = {
      id: input.id ?? createId(),
      slug,
      status: OrganizationStatus.PENDING,
      profile: {
        ...input.profile,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.registry.register(organization);

    return organization;
  }

  updateProfile(
    organizationId: string,
    profile: Partial<OrganizationProfile>,
  ): Organization {
    const organization = this.requireOrganization(organizationId);

    organization.profile = {
      ...organization.profile,
      ...profile,
    };

    organization.updatedAt = new Date();

    return organization;
  }

  activateOrganization(
    organizationId: string,
  ): Organization {
    return this.setOrganizationStatus(
      organizationId,
      OrganizationStatus.ACTIVE,
    );
  }

  suspendOrganization(
    organizationId: string,
  ): Organization {
    return this.setOrganizationStatus(
      organizationId,
      OrganizationStatus.SUSPENDED,
    );
  }

  archiveOrganization(
    organizationId: string,
  ): Organization {
    return this.setOrganizationStatus(
      organizationId,
      OrganizationStatus.ARCHIVED,
    );
  }

  registerPermission(
    permission: Permission,
  ): void {
    if (this.permissions.has(permission.id)) {
      throw new Error(
        `Permission '${permission.id}' is already registered.`,
      );
    }

    const duplicateKey = [...this.permissions.values()].some(
      existing =>
        existing.key.toLowerCase() ===
        permission.key.toLowerCase(),
    );

    if (duplicateKey) {
      throw new Error(
        `Permission key '${permission.key}' is already in use.`,
      );
    }

    this.permissions.set(permission.id, permission);
  }

  registerRole(
    role: Role,
  ): void {
    if (this.roles.has(role.id)) {
      throw new Error(`Role '${role.id}' is already registered.`);
    }

    for (const permissionId of role.permissionIds) {
      if (!this.permissions.has(permissionId)) {
        throw new Error(
          `Role '${role.id}' references unknown permission '${permissionId}'.`,
        );
      }
    }

    this.roles.set(role.id, role);
  }

  inviteMember(
    input: InviteMembershipInput,
  ): Membership {
    this.requireOrganization(input.organizationId);

    if (!input.userId.trim()) {
      throw new Error("User ID is required for membership invite.");
    }

    const activeMembership =
      this.findMembershipByUserAndOrganization(
        input.userId,
        input.organizationId,
      );

    if (
      activeMembership &&
      activeMembership.status !== MembershipStatus.LEFT
    ) {
      throw new Error(
        "Membership already exists for this user in organization.",
      );
    }

    const roleIds = input.roleIds ?? [];

    for (const roleId of roleIds) {
      if (!this.roles.has(roleId)) {
        throw new Error(`Unknown role '${roleId}'.`);
      }
    }

    const membership: Membership = {
      id: input.id ?? createId(),
      userId: input.userId.trim(),
      organizationId: input.organizationId,
      roleIds: [...roleIds],
      status: MembershipStatus.INVITED,
      joinedAt: new Date(),
    };

    this.memberships.set(membership.id, membership);

    return membership;
  }

  activateMembership(
    membershipId: string,
  ): Membership {
    return this.setMembershipStatus(
      membershipId,
      MembershipStatus.ACTIVE,
    );
  }

  suspendMembership(
    membershipId: string,
  ): Membership {
    return this.setMembershipStatus(
      membershipId,
      MembershipStatus.SUSPENDED,
    );
  }

  leaveMembership(
    membershipId: string,
  ): Membership {
    return this.setMembershipStatus(
      membershipId,
      MembershipStatus.LEFT,
    );
  }

  assignRoles(
    membershipId: string,
    roleIds: readonly string[],
  ): Membership {
    const membership = this.requireMembership(membershipId);

    for (const roleId of roleIds) {
      if (!this.roles.has(roleId)) {
        throw new Error(`Unknown role '${roleId}'.`);
      }
    }

    membership.roleIds = [...roleIds];

    return membership;
  }

  can(
    organizationId: string,
    userId: string,
    permissionKey: string,
  ): boolean {
    const organization = this.registry.get(organizationId);

    if (!organization || organization.status !== OrganizationStatus.ACTIVE) {
      return false;
    }

    const membership = this.findMembershipByUserAndOrganization(
      userId,
      organizationId,
    );

    if (!membership || membership.status !== MembershipStatus.ACTIVE) {
      return false;
    }

    const permission = [...this.permissions.values()].find(
      value => value.key.toLowerCase() === permissionKey.toLowerCase(),
    );

    if (!permission) {
      return false;
    }

    return membership.roleIds.some(roleId => {
      const role = this.roles.get(roleId);
      return role
        ? role.permissionIds.includes(permission.id)
        : false;
    });
  }

  listOrganizations(): readonly Organization[] {
    return this.registry.all();
  }

  listMembershipsByOrganization(
    organizationId: string,
  ): readonly Membership[] {
    return [...this.memberships.values()].filter(
      membership => membership.organizationId === organizationId,
    );
  }

  listMembershipsByUser(
    userId: string,
  ): readonly Membership[] {
    return [...this.memberships.values()].filter(
      membership => membership.userId === userId,
    );
  }

  countOrganizations(): number {
    return this.registry.count();
  }

  private setOrganizationStatus(
    organizationId: string,
    status: OrganizationStatus,
  ): Organization {
    const organization = this.requireOrganization(organizationId);

    organization.status = status;
    organization.updatedAt = new Date();

    return organization;
  }

  private setMembershipStatus(
    membershipId: string,
    status: MembershipStatus,
  ): Membership {
    const membership = this.requireMembership(membershipId);

    membership.status = status;

    return membership;
  }

  private requireOrganization(
    organizationId: string,
  ): Organization {
    const organization = this.registry.get(organizationId);

    if (!organization) {
      throw new Error(
        `Organization '${organizationId}' not found.`,
      );
    }

    return organization;
  }

  private requireMembership(
    membershipId: string,
  ): Membership {
    const membership = this.memberships.get(membershipId);

    if (!membership) {
      throw new Error(
        `Membership '${membershipId}' not found.`,
      );
    }

    return membership;
  }

  private findMembershipByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Membership | undefined {
    return [...this.memberships.values()].find(
      membership =>
        membership.userId === userId &&
        membership.organizationId === organizationId,
    );
  }
}
