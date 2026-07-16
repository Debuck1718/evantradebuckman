import type { LucideIcon } from "lucide-react";

/* ============================================================
   Common Actions
============================================================ */

export interface CompanyAction {
  label: string;
  href: string;
}

/* ============================================================
   Hero
============================================================ */

export interface CompanyMetric {
  value: string;
  label: string;
  description?: string;
  trend?: string;
}

export interface CompanyHero {
  badge: string;
  title: string;
  description: string;
  image: string;

  primaryAction: CompanyAction;
  secondaryAction: CompanyAction;

  metrics: CompanyMetric[];
}

/* ============================================================
   Mission
============================================================ */

export interface CompanyMission {
  title: string;
  description: string;
}

/* ============================================================
   Feature Cards
   Used by:
   - Capabilities
   - Solutions
   - Culture
============================================================ */

export interface CompanyFeature {
  title: string;

  description: string;

  icon: LucideIcon;

  tags?: string[];

  href?: string;

  featured?: boolean;
}

/* ============================================================
   Products
============================================================ */

export interface CompanyProduct {
  category: string;

  title: string;

  description: string;

  icon: LucideIcon;

  tags?: string[];

  featured?: boolean;

  href?: string;

  status?:
    | "Live"
    | "In Development"
    | "Research"
    | "Coming Soon";
}

/* ============================================================
   Technology Stack
============================================================ */
export interface TechnologyItem {
  title: string;

  description?: string;
}

export interface TechnologyCategory {
  name: string;

  title: string;

  description?: string;

  technologies: TechnologyItem[];
}

/* ============================================================
   Research Timeline
============================================================ */

export interface CompanyTimelineItem {
  year: string;

  title: string;

  description: string;

  icon: LucideIcon;

  tags?: string[];
}

/* ============================================================
   Careers
============================================================ */

export interface CompanyCareers {
  title: string;

  description: string;
}

/* ============================================================
   Complete Company
============================================================ */

export interface CompanyData {
  slug: string;

  name: string;

  hero: CompanyHero;

  featuredShowcase: CompanyFeaturedShowcase;

  mission: CompanyMission;

  capabilities: CompanyFeature[];

  solutions: CompanyFeature[];

  technologies: TechnologyCategory[];

  products: CompanyProduct[];

  research: CompanyTimelineItem[];

  culture: CompanyFeature[];

  careers: CompanyCareers;
}

export interface ShowcaseHighlight {
  title: string;

  description: string;

  icon: LucideIcon;
}

export interface DashboardMetric {
  label: string;

  value: string;

  icon?: LucideIcon;

  position: string;
}

export interface CompanyFeaturedShowcase {
  badge: string;

  title: string;

  subtitle?: string;

  description: string;

  image: string;

  metrics?: CompanyMetric[];

  dashboardMetrics?: DashboardMetric[];

  highlights: ShowcaseHighlight[];

  primaryAction?: CompanyAction;

  secondaryAction?: CompanyAction;
}