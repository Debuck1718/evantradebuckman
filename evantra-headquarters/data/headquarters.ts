import {
  BrainCircuit,
  Building2,
  Code2,
  Cpu,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { aiCompany } from "./companies/ai";
import { commerceCompany } from "./companies/commerce";
import { cybersecurityCompany } from "./companies/cybersecurity";
import { engineeringCompany } from "./companies/engineering";
import { innovationCompany } from "./companies/innovation";
import { softwareCompany } from "./companies/software";
import type { CompanyData } from "./companies/types";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CenterAccent =
  | "ai"
  | "commerce"
  | "engineering"
  | "innovation"
  | "software"
  | "cybersecurity";

export interface HeadquartersCenter {
  id: string;
  icon: LucideIcon;
  accent: CenterAccent;
  company: CompanyData;
}

export interface HeadquartersData {
  name: string;
  slogan: string;
  description: string;
  centers: HeadquartersCenter[];
}

/* -------------------------------------------------------------------------- */
/*                              Headquarters Data                             */
/* -------------------------------------------------------------------------- */

export const headquarters: HeadquartersData = {
  name: "Evantra Headquarters",

  slogan: "Engineering Technology That Serves People.",

  description:
    "Evantra Headquarters brings together our centers of excellence, products, research and innovation to solve meaningful global challenges through technology.",

  centers: [
    {
      id: "artificial-intelligence",
      icon: BrainCircuit,
      accent: "ai",
      company: aiCompany,
    },

    {
      id: "commerce",
      icon: Building2,
      accent: "commerce",
      company: commerceCompany,
    },

    {
      id: "engineering",
      icon: Cpu,
      accent: "engineering",
      company: engineeringCompany,
    },

    {
      id: "innovation",
      icon: Lightbulb,
      accent: "innovation",
      company: innovationCompany,
    },

    {
      id: "software",
      icon: Code2,
      accent: "software",
      company: softwareCompany,
    },

    {
      id: "cybersecurity",
      icon: ShieldCheck,
      accent: "cybersecurity",
      company: cybersecurityCompany,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                               Registry Exports                             */
/* -------------------------------------------------------------------------- */

export const headquartersCenters = headquarters.centers;

export const headquartersCenterMap = new Map(
  headquarters.centers.map((center) => [center.company.slug, center])
);

export const headquartersCenterIdMap = new Map(
  headquarters.centers.map((center) => [center.id, center])
);

export const headquartersSlugs = headquarters.centers.map(
  (center) => center.company.slug
);

export const headquartersIds = headquarters.centers.map(
  (center) => center.id
);

/* -------------------------------------------------------------------------- */
/*                           Center Relationships                             */
/* -------------------------------------------------------------------------- */

const RELATED_CENTERS: Record<string, string[]> = {
  "artificial-intelligence": [
    "engineering",
    "software",
    "cybersecurity",
  ],

  commerce: [
    "software",
    "artificial-intelligence",
    "cybersecurity",
  ],

  engineering: [
    "artificial-intelligence",
    "innovation",
    "software",
  ],

  innovation: [
    "engineering",
    "artificial-intelligence",
    "software",
  ],

  software: [
    "artificial-intelligence",
    "cybersecurity",
    "commerce",
  ],

  cybersecurity: [
    "software",
    "artificial-intelligence",
    "commerce",
  ],
};

/* -------------------------------------------------------------------------- */
/*                               Helper Methods                               */
/* -------------------------------------------------------------------------- */

export function getAllCenters() {
  return headquartersCenters;
}

export function getCenter(slug: string) {
  return headquartersCenterMap.get(slug) ?? null;
}

export function getCenterById(id: string) {
  return headquartersCenterIdMap.get(id) ?? null;
}

export function getPreviousCenter(slug: string) {
  const index = headquartersCenters.findIndex(
    (center) => center.company.slug === slug
  );

  if (index <= 0) {
    return null;
  }

  return headquartersCenters[index - 1];
}

export function getNextCenter(slug: string) {
  const index = headquartersCenters.findIndex(
    (center) => center.company.slug === slug
  );

  if (index === -1 || index >= headquartersCenters.length - 1) {
    return null;
  }

  return headquartersCenters[index + 1];
}

export function getRelatedCenters(slug: string) {
  const center = getCenter(slug);

  if (!center) {
    return [];
  }

  const relatedIds = RELATED_CENTERS[center.id] ?? [];

  return relatedIds
    .map((id) => headquartersCenterIdMap.get(id))
    .filter(
      (item): item is HeadquartersCenter => item !== undefined
    );
}