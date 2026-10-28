import {
  BookOpen,
  Clapperboard,
  Frame,
  GraduationCap,
  Images,
  MessagesSquare,
  Newspaper,
  Ruler,
  Video,
} from "lucide-react";

export interface EcosystemItem {
  id: string;

  /** Public facing name of the partner product. */
  title: string;

  /** Short descriptor, used as the card eyebrow. */
  eyebrow: string;

  /** One line positioning statement pulled from the product itself. */
  tagline: string;

  /** What the product does, in two sentences. */
  description: string;

  icon: typeof Clapperboard;

  /** Public link to the product. */
  href: string;

  /** Brand accent used for the icon, eyebrow and link colour. */
  color: string;

  /** Small capability labels displayed as chips. */
  highlights: string[];

  /** "Live" products are shipped and publicly accessible. */
  status: "Live" | "In development";

  /** Short domain shown as the link preview inside the card. */
  domain: string;

  /** Category used for the filter tabs. */
  category: EcosystemCategory;

  /** Sort order for the grid. */
  order: number;
}

export type EcosystemCategory =
  | "All products"
  | "Media"
  | "Creative studio"
  | "Education";

export const ecosystemCategories: EcosystemCategory[] = [
  "All products",
  "Media",
  "Creative studio",
  "Education",
];

export const ecosystemData: EcosystemItem[] = [
  {
    id: "nicks-media",

    title: "Nick's Media",
    eyebrow: "Media house",
    tagline: "Independent journalism. Made to move.",

    description:
      "A modern media house combining journalism, creative production and broadcast — original reporting, explainers, investigations, cultural analysis and video built for every screen.",

    icon: Clapperboard,

    href: "https://nicks-media-red.vercel.app/",
    color: "#C43B3B",

    highlights: ["Newsroom", "Live desk", "Video & broadcast"],

    status: "Live",
    domain: "nicks-media-red.vercel.app",
    category: "Media",
    order: 1,
  },

  {
    id: "azibk-framing",

    title: "AZIBK Framing",
    eyebrow: "Picture framing studio",
    tagline: "Bespoke framing, finished by hand.",

    description:
      "A picture framing studio based in Accra taking commissions for custom hardwood and metal frames, conservation mounting and museum-grade glazing — with a two-week turnaround.",

    icon: Frame,

    href: "https://azibk.vercel.app/",
    color: "#B7852B",

    highlights: ["Bespoke frames", "Conservation mounting", "Museum glazing"],

    status: "Live",
    domain: "azibk.vercel.app",
    category: "Creative studio",
    order: 2,
  },

  {
    id: "evantrahub",

    title: "EvantraHub",
    eyebrow: "Education platform",
    tagline: "One place for every course material.",

    description:
      "An academic platform that centralises course slides, past questions, discussions and announcements, while giving course representatives a simple way to upload and share learning resources.",

    icon: GraduationCap,

    href: "https://www.evantrahub.me/",
    color: "#0B6E88",

    highlights: ["Course slides", "Past questions", "Academic forums"],

    status: "Live",
    domain: "evantrahub.me",
    category: "Education",
    order: 3,
  },
];

/**
 * Product capabilities surfaced in each card so the section reads
 * like a product collection instead of a link list.
 */
export const ecosystemCapabilities = {
  "nicks-media": [
    { label: "Reporting", icon: Newspaper },
    { label: "Video", icon: Video },
    { label: "Editorial", icon: MessagesSquare },
  ],

  "azibk-framing": [
    { label: "Framing", icon: Frame },
    { label: "Measuring", icon: Ruler },
    { label: "Gallery work", icon: Images },
  ],

  evantrahub: [
    { label: "Course slides", icon: BookOpen },
    { label: "Study library", icon: GraduationCap },
    { label: "Discussion", icon: MessagesSquare },
  ],
} as const;

export const ecosystemStats = {
  products: ecosystemData.length,
  live: ecosystemData.filter((item) => item.status === "Live").length,
  categories: ecosystemCategories.length - 1,
};
