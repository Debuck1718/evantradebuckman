import {
  BrainCircuit,
  Building2,
  Cpu,
  ShieldCheck,
  FlaskConical,
  Globe2,
} from "lucide-react";

export interface EcosystemItem {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof BrainCircuit;
  href: string;
  color: string;
}

export const ecosystemData: EcosystemItem[] = [
  {
    id: "software-engineering",

    title: "Software Engineering",

    eyebrow: "Digital Platforms",

    description:
      "Enterprise software, cloud platforms, automation and digital transformation solutions engineered for scale.",

    icon: Cpu,

    href: "/companies/software",

    color: "#0B4F71",
  },

  {
    id: "artificial-intelligence",

    title: "Artificial Intelligence",

    eyebrow: "AI & Intelligent Systems",

    description:
      "Building intelligent systems that enhance decision making, productivity and human capability.",

    icon: BrainCircuit,

    href: "/companies/artificial-intelligence",

    color: "#D2A339",
  },

  {
    id: "cybersecurity",

    title: "Cybersecurity",

    eyebrow: "Security & Trust",

    description:
      "Protecting digital infrastructure through modern security architecture, resilience and governance.",

    icon: ShieldCheck,

    href: "/companies/cybersecurity",

    color: "#0B4F71",
  },

  {
    id: "research",

    title: "Research & Innovation",

    eyebrow: "Future Technologies",

    description:
      "Applied research transforming emerging technologies into practical products and services.",

    icon: FlaskConical,

    href: "/research",

    color: "#D2A339",
  },

  {
    id: "infrastructure",

    title: "Smart Infrastructure",

    eyebrow: "Connected Systems",

    description:
      "IoT, intelligent infrastructure and sustainable engineering solutions for tomorrow's cities.",

    icon: Building2,

    href: "/companies/infrastructure",

    color: "#0B4F71",
  },

  {
    id: "trade",

    title: "Import & Export",

    eyebrow: "Global Commerce",

    description:
      "Connecting global markets through technology-enabled logistics, trade and strategic partnerships.",

    icon: Globe2,

    href: "/companies/import-export",

    color: "#D2A339",
  },
];