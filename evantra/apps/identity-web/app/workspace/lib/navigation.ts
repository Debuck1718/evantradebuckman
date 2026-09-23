import {
  Bot,
  BrainCircuit,
  Calendar,
  FileText,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

/**
 * Workspace navigation model.
 *
 * The workspace used to render every
 * destination as one flat row of links,
 * which became an unreadable strip of
 * tabs on wide screens and a horizontal
 * scroller on phones.
 *
 * Grouping the same destinations by what
 * the visitor is trying to do lets the
 * shell render a compact labeled sidebar
 * on large screens and a single drawer on
 * small screens without losing any route.
 */
export interface WorkspaceNavItem {
  /** Destination. */
  readonly href: string;

  /** Visible label. */
  readonly label: string;

  /** Icon shown beside the label. */
  readonly icon: LucideIcon;

  /** Short line shown in command surfaces. */
  readonly description: string;
}

export interface WorkspaceNavGroup {
  /** Group heading. */
  readonly label: string;

  /** Destinations in this group. */
  readonly items: readonly WorkspaceNavItem[];
}

export const workspaceNavigation: readonly WorkspaceNavGroup[] = [
  {
    label: "Command",
    items: [
      {
        href: "/workspace/hub",
        label: "Hub",
        icon: LayoutDashboard,
        description:
          "Your command center and live workspace telemetry.",
      },
      {
        href: "/workspace/assistant",
        label: "Assistant",
        icon: Bot,
        description:
          "Grounded answers across your workspace context.",
      },
      {
        href: "/workspace/plan",
        label: "Plan",
        icon: FileText,
        description:
          "Generate a daily life-work operating plan.",
      },
    ],
  },
  {
    label: "Work",
    items: [
      {
        href: "/workspace/promises",
        label: "Promises",
        icon: FileText,
        description:
          "Track commitments, due dates and trust ratings.",
      },
      {
        href: "/workspace/calendar",
        label: "Calendar",
        icon: Calendar,
        description:
          "Allocate deep-work blocks and recovery windows.",
      },
      {
        href: "/workspace/burden",
        label: "Burden",
        icon: BrainCircuit,
        description:
          "Monitor cognitive load and burnout guardrails.",
      },
      {
        href: "/workspace/knowledge",
        label: "Knowledge",
        icon: FileText,
        description:
          "Your interconnected second brain and research graph.",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/workspace/finance",
        label: "Finance",
        icon: WalletCards,
        description:
          "Income, expenses and decision-ready money signals.",
      },
      {
        href: "/workspace/organizations",
        label: "Organizations",
        icon: Users,
        description:
          "Teams, memberships and collaboration.",
      },
      {
        href: "/workspace/applications",
        label: "Applications",
        icon: KeyRound,
        description:
          "OAuth clients, redirect URIs and developer access.",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/workspace/account",
        label: "Account",
        icon: Users,
        description:
          "Profile, identity details and zero-knowledge vault.",
      },
      {
        href: "/workspace/support",
        label: "Support",
        icon: LifeBuoy,
        description:
          "Requests, tickets and help from the Evantra team.",
      },
    ],
  },
];

/**
 * Every destination flattened, used by
 * the command palette and quick links.
 */
export const workspaceNavItems: readonly WorkspaceNavItem[] =
  workspaceNavigation.flatMap((group) => group.items);