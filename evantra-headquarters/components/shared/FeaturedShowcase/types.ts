import type { LucideIcon } from "lucide-react";
import type {
  CompanyAction,
  CompanyMetric,
  DashboardMetric,
  ShowcaseHighlight,
} from "@/data/companies/types";

export interface FeaturedShowcaseProps {
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

  reverse?: boolean;
}