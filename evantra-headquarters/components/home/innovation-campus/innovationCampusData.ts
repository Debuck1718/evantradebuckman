import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Bot,
  Globe2,
} from "lucide-react";

export interface InnovationHighlight {
  id: string;
  title: string;
  description: string;
  icon: typeof BrainCircuit;
}

export const innovationCampusData: InnovationHighlight[] = [
  {
    id: "ai",
    title: "AI Research Centre",
    description:
      "Applied artificial intelligence research focused on solving African and global challenges.",
    icon: BrainCircuit,
  },
  {
    id: "cyber",
    title: "Cybersecurity Operations",
    description:
      "Security operations, resilience engineering and digital trust initiatives.",
    icon: ShieldCheck,
  },
  {
    id: "engineering",
    title: "Engineering Hub",
    description:
      "Advanced engineering teams building software, infrastructure and connected systems.",
    icon: Cpu,
  },
  {
    id: "robotics",
    title: "Robotics & Automation",
    description:
      "Developing intelligent robotics and automation technologies for industry.",
    icon: Bot,
  },
  {
    id: "innovation",
    title: "Innovation Plaza",
    description:
      "A collaborative environment where research, startups and global partners innovate together.",
    icon: Globe2,
  },
];