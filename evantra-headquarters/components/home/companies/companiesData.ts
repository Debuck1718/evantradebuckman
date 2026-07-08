export interface CampusCenter {
  id: string;

  /** Display */
  name: string;
  category: string;
  tagline: string;
  description: string;

  /** Campus */
  campusLocation: string;
  established: string;
  status:
    | "Operational"
    | "Under Development"
    | "Coming Soon";

  /** Assets */
  heroImage: string;
  imageAlt: string;

  /** Navigation */
  href: string;

  /** Theme */
  accent: "blue" | "gold" | "teal";

  /** Technologies */
  technologies: string[];
}

export const companiesData: CampusCenter[] = [
  {
    id: "software",

    name: "Evantra Software Center",

    category: "Enterprise Technology",

    tagline: "Building Intelligent Digital Platforms",

    description:
      "Enterprise software, cloud platforms, artificial intelligence and digital transformation technologies powering businesses and governments.",

    campusLocation: "Digital Systems Wing",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/software-center.webp",

    imageAlt:
      "Evantra Software Center within the Evantra Innovation Campus.",

    href: "/companies/software",

    accent: "blue",

    technologies: [
      "Artificial Intelligence",
      "Cloud Computing",
      "Enterprise Systems",
      "Automation",
    ],
  },

  {
    id: "cybersecurity",

    name: "Evantra Cybersecurity Center",

    category: "Digital Trust",

    tagline: "Protecting Critical Infrastructure",

    description:
      "Advanced cybersecurity, governance, resilience engineering and digital trust protecting enterprises, governments and critical infrastructure.",

    campusLocation: "Security Operations Wing",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/cybersecurity-center.webp",

    imageAlt:
      "Evantra Cybersecurity Center within the Innovation Campus.",

    href: "/companies/cybersecurity",

    accent: "gold",

    technologies: [
      "SOC",
      "Zero Trust",
      "Threat Intelligence",
      "Compliance",
    ],
  },

  {
    id: "engineering",

    name: "Evantra Engineering Center",

    category: "Engineering",

    tagline: "Engineering Tomorrow's Infrastructure",

    description:
      "Engineering intelligent infrastructure, robotics, automation and connected environments for sustainable development.",

    campusLocation: "Engineering District",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/engineering-center.webp",

    imageAlt:
      "Evantra Engineering Center at the Innovation Campus.",

    href: "/companies/engineering",

    accent: "teal",

    technologies: [
      "IoT",
      "Robotics",
      "Automation",
      "Infrastructure",
    ],
  },

  {
    id: "innovation",

    name: "Evantra Innovation Hub",

    category: "Innovation",

    tagline: "Where Ideas Become Breakthroughs",

    description:
      "A collaborative innovation environment bringing together researchers, startups and global partners to transform ideas into scalable technologies.",

    campusLocation: "Innovation District",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/innovation-hub.webp",

    imageAlt:
      "Evantra Innovation Hub inside the Innovation Campus.",

    href: "/companies/innovation",

    accent: "gold",

    technologies: [
      "Incubation",
      "Startups",
      "Research",
      "Innovation",
    ],
  },

  {
    id: "ai",

    name: "Evantra AI Research Center",

    category: "Artificial Intelligence",

    tagline: "Advancing Machine Intelligence",

    description:
      "Applied artificial intelligence research focused on healthcare, education, enterprise transformation and responsible AI.",

    campusLocation: "Research Wing",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/ai-research-center.webp",

    imageAlt:
      "Evantra AI Research Center connected to the Headquarters.",

    href: "/companies/artificial-intelligence",

    accent: "blue",

    technologies: [
      "Machine Learning",
      "Computer Vision",
      "LLMs",
      "Ethical AI",
    ],
  },

  {
    id: "commerce",

    name: "Global Commerce Center",

    category: "Import & Export",

    tagline: "Connecting Markets Worldwide",

    description:
      "Supporting international trade, logistics, procurement and cross-border commerce through intelligent digital infrastructure.",

    campusLocation: "Commerce District",

    established: "2026",

    status: "Operational",

    heroImage: "/images/campus/global-commerce-center.webp",

    imageAlt:
      "Global Commerce Center within the Evantra Innovation Campus.",

    href: "/companies/global-commerce",

    accent: "teal",

    technologies: [
      "Global Trade",
      "Logistics",
      "Procurement",
      "Supply Chain",
    ],
  },
];