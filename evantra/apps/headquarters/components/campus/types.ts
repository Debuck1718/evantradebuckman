export interface CampusCenter {
  /** Unique identifier */
  id: string;

  /** Display */
  name: string;
  category: string;
  tagline: string;
  description: string;

  /** Campus */
  campusDistrict: string;
  established: string;
  status: "Operational" | "Coming Soon";

  /** Map Position (%) */
  x: number;
  y: number;

  /** Assets */
  image: string;
  imageAlt: string;

  /** Navigation */
  href: string;

  /** Theme */
  accent: "blue" | "gold" | "teal";

  /** Technologies */
  technologies: string[];
}