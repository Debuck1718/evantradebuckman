import type { HeadquartersCenter } from "@/data/headquarters";

export interface CenterCardData {
  id: string;
  slug: string;

  title: string;

  description: string;

  accent: HeadquartersCenter["accent"];

  icon: HeadquartersCenter["icon"];
}

export function toCenterCard(
  center: HeadquartersCenter
): CenterCardData {
  return {
    id: center.id,

    slug: center.company.slug,

    title: center.company.name,

    description: center.company.hero.description,

    accent: center.accent,

    icon: center.icon,
  };
}