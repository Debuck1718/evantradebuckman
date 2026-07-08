export interface CampusLocation {
  /** Unique ID */
  id: string;

  /** Display */
  name: string;
  shortName: string;
  category: string;
  district: string;

  /** Description */
  description: string;

  /** Navigation */
  href: string;

  /** Assets */
  image: string;

  /** Theme */
  accent: "gold" | "blue" | "teal";

  /** Status */
  status: "Operational" | "Coming Soon";

  /** Marker Position (percentage) */
  x: number;
  y: number;

  /** Technologies */
  technologies: string[];
}

export const campusMapData: CampusLocation[] = [
  {
    id: "headquarters",
    name: "Evantra Headquarters",
    shortName: "HQ",
    category: "Corporate Headquarters",
    district: "Central Administration District",

    description:
      "The heart of the Evantra Innovation Campus, housing executive leadership, global operations, strategy, and the digital command center.",

    href: "/headquarters",

    image: "/images/campus/headquarters.webp",

    accent: "gold",

    status: "Operational",

    x: 50,
    y: 41,

    technologies: [
      "Executive Leadership",
      "Digital Operations",
      "Strategy",
      "Corporate Services",
    ],
  },

  {
    id: "ai",
    name: "AI Research Center",
    shortName: "AI",
    category: "Artificial Intelligence",
    district: "Research District",

    description:
      "Applied artificial intelligence research focused on healthcare, enterprise transformation, computer vision and responsible AI.",

    href: "/companies/artificial-intelligence",

    image: "/images/campus/ai-research-center.webp",

    accent: "blue",

    status: "Operational",

    x: 31,
    y: 54,

    technologies: [
      "Machine Learning",
      "Computer Vision",
      "LLMs",
      "Responsible AI",
    ],
  },

  {
    id: "cybersecurity",
    name: "Cybersecurity Center",
    shortName: "Cyber",
    category: "Cybersecurity",
    district: "Security District",

    description:
      "Advanced cyber defence, security operations, digital forensics and zero-trust research protecting critical infrastructure.",

    href: "/companies/cybersecurity",

    image: "/images/campus/cybersecurity-center.webp",

    accent: "gold",

    status: "Operational",

    x: 23,
    y: 27,

    technologies: [
      "SOC",
      "Threat Intelligence",
      "Digital Forensics",
      "Zero Trust",
    ],
  },

  {
    id: "commerce",
    name: "Global Commerce Center",
    shortName: "Commerce",
    category: "Import & Export",
    district: "International Commerce District",

    description:
      "Supporting global trade, procurement, logistics, customs and intelligent supply chain operations.",

    href: "/companies/global-commerce",

    image: "/images/campus/global-commerce-center.webp",

    accent: "teal",

    status: "Operational",

    x: 72,
    y: 27,

    technologies: [
      "Supply Chain",
      "Logistics",
      "Procurement",
      "Global Trade",
    ],
  },

  {
    id: "innovation",
    name: "Innovation Hub",
    shortName: "Innovation",
    category: "Innovation",
    district: "Innovation District",

    description:
      "A collaborative ecosystem where startups, researchers and industry partners transform ideas into scalable products.",

    href: "/companies/innovation",

    image: "/images/campus/innovation-hub.webp",

    accent: "gold",

    status: "Operational",

    x: 72,
    y: 55,

    technologies: [
      "Startups",
      "Incubation",
      "Research",
      "Innovation",
    ],
  },

  {
    id: "engineering",
    name: "Engineering Center",
    shortName: "Engineering",
    category: "Engineering",
    district: "Engineering District",

    description:
      "Engineering robotics, automation, smart infrastructure and industrial technologies for sustainable development.",

    href: "/companies/engineering",

    image: "/images/campus/engineering-center.webp",

    accent: "teal",

    status: "Operational",

    x: 69,
    y: 78,

    technologies: [
      "Robotics",
      "Automation",
      "IoT",
      "Infrastructure",
    ],
  },
];