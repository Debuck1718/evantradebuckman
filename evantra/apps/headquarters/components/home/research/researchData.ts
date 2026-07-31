import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Bot,
  Network,
  Leaf,
} from "lucide-react";

export interface ResearchArea {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: typeof BrainCircuit;
}

export const researchData: ResearchArea[] = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    category: "Machine Intelligence",
    description:
      "Applied AI solutions focused on productivity, healthcare, education and enterprise transformation.",
    icon: BrainCircuit,
  },

  {
    id: "cyber",
    title: "Cybersecurity",
    category: "Digital Trust",
    description:
      "Advanced cybersecurity, governance and resilient digital infrastructure.",
    icon: ShieldCheck,
  },

  {
    id: "engineering",
    title: "Software Engineering",
    category: "Engineering",
    description:
      "Building scalable platforms and cloud-native enterprise systems.",
    icon: Cpu,
  },

  {
    id: "robotics",
    title: "Robotics",
    category: "Automation",
    description:
      "Human-centered robotics and intelligent automation technologies.",
    icon: Bot,
  },

  {
    id: "iot",
    title: "Smart Infrastructure",
    category: "Connected Systems",
    description:
      "IoT, smart cities and intelligent infrastructure for sustainable development.",
    icon: Network,
  },

  {
    id: "sustainability",
    title: "Sustainability",
    category: "Future Communities",
    description:
      "Engineering technologies supporting environmental resilience and responsible innovation.",
    icon: Leaf,
  },
];