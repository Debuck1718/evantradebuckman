export interface EcosystemNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

export const ecosystemMapData: EcosystemNode[] = [
  {
    id: "engineering",
    title: "Engineering",
    subtitle: "Design",
    description:
      "Engineering practical technologies that solve real-world challenges.",
    href: "/companies/engineering",
  },

  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    subtitle: "Intelligence",
    description:
      "Building intelligent systems that enhance human capability.",
    href: "/companies/artificial-intelligence",
  },

  {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Protection",
    description:
      "Securing digital infrastructure through resilient security.",
    href: "/companies/cybersecurity",
  },

  {
    id: "research",
    title: "Research",
    subtitle: "Innovation",
    description:
      "Turning emerging technologies into practical products.",
    href: "/research",
  },

  {
    id: "infrastructure",
    title: "Infrastructure",
    subtitle: "Connectivity",
    description:
      "Creating intelligent connected environments and smart cities.",
    href: "/companies/engineering",
  },

  {
    id: "commerce",
    title: "Global Commerce",
    subtitle: "Trade",
    description:
      "Connecting industries through technology-enabled commerce.",
    href: "/companies/commerce",
  },
];