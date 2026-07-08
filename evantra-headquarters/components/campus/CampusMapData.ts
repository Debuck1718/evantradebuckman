import type { CampusCenter } from "./types";

export const campusMapData: CampusCenter[] = [
  {
    id: "headquarters",

    name: "Evantra Headquarters",

    category: "Corporate Headquarters",

    tagline: "Leading Global Innovation",

    description:
      "The central headquarters bringing together executive leadership, strategic operations, AI research and innovation across the Evantra ecosystem.",

    campusDistrict: "Central District",

    established: "2026",

    status: "Operational",

    x: 49,

    y: 45,

    image: "/images/campus/headquarters.webp",

    imageAlt: "Evantra Headquarters",

    href: "/headquarters",

    accent: "gold",

    technologies: [
      "Leadership",
      "Innovation",
      "AI",
      "Strategy",
    ],
  },

  {
    id: "software",

    name: "Software Center",

    category: "Enterprise Technology",

    tagline: "Building Intelligent Digital Platforms",

    description:
      "Enterprise software engineering, cloud computing and digital transformation technologies.",

    campusDistrict: "Digital Systems Wing",

    established: "2026",

    status: "Operational",

    x: 28,

    y: 63,

    image: "/images/campus/software-center.webp",

    imageAlt: "Software Center",

    href: "/companies/software",

    accent: "blue",

    technologies: [
      "AI",
      "Cloud",
      "Enterprise",
      "Automation",
    ],
  },

  {
    id: "cybersecurity",

    name: "Cybersecurity Center",

    category: "Digital Trust",

    tagline: "Protecting Critical Infrastructure",

    description:
      "Cyber resilience, governance and digital trust protecting modern organizations.",

    campusDistrict: "Security Operations Wing",

    established: "2026",

    status: "Operational",

    x: 63,

    y: 58,

    image: "/images/campus/cybersecurity-center.webp",

    imageAlt: "Cybersecurity Center",

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

    name: "Engineering Center",

    category: "Engineering",

    tagline: "Engineering Tomorrow",

    description:
      "Advanced robotics, intelligent infrastructure and industrial automation.",

    campusDistrict: "Engineering District",

    established: "2026",

    status: "Operational",

    x: 74,

    y: 40,

    image: "/images/campus/engineering-center.webp",

    imageAlt: "Engineering Center",

    href: "/companies/engineering",

    accent: "teal",

    technologies: [
      "Robotics",
      "Automation",
      "IoT",
      "Infrastructure",
    ],
  },

  {
    id: "innovation",

    name: "Innovation Hub",

    category: "Innovation",

    tagline: "Where Ideas Become Reality",

    description:
      "Collaborative innovation ecosystem connecting researchers, startups and industry partners.",

    campusDistrict: "Innovation District",

    established: "2026",

    status: "Operational",

    x: 22,

    y: 34,

    image: "/images/campus/innovation-hub.webp",

    imageAlt: "Innovation Hub",

    href: "/companies/innovation",

    accent: "gold",

    technologies: [
      "Innovation",
      "Research",
      "Incubation",
      "Collaboration",
    ],
  },

  {
    id: "ai",

    name: "AI Research Center",

    category: "Artificial Intelligence",

    tagline: "Advancing Machine Intelligence",

    description:
      "Applied AI research focusing on enterprise intelligence, healthcare and education.",

    campusDistrict: "Research Wing",

    established: "2026",

    status: "Operational",

    x: 56,

    y: 26,

    image: "/images/campus/ai-research-center.webp",

    imageAlt: "AI Research Center",

    href: "/companies/artificial-intelligence",

    accent: "blue",

    technologies: [
      "Machine Learning",
      "Computer Vision",
      "LLMs",
      "Ethical AI",
    ],
  },
];