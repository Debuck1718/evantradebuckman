import {
  Globe2,
  GraduationCap,
  Building2,
 ShieldCheck,
  Cpu,
  Leaf,
} from "lucide-react";

export interface ImpactArea {
  id: string;
  title: string;
  description: string;
  icon: typeof Globe2;
}

export const impactData: ImpactArea[] = [
  {
    id: "innovation",
    title: "Technology Innovation",
    description:
      "Building technologies that improve lives and accelerate digital transformation across industries.",
    icon: Cpu,
  },
  {
    id: "education",
    title: "Digital Skills",
    description:
      "Supporting future engineers, researchers and technology leaders through learning and mentorship.",
    icon: GraduationCap,
  },
  {
    id: "communities",
    title: "Communities",
    description:
      "Creating solutions that strengthen businesses, institutions and local communities.",
    icon: Building2,
  },
  {
    id: "security",
    title: "Digital Trust",
    description:
      "Improving cybersecurity resilience and confidence in the digital economy.",
    icon: ShieldCheck,
  },
  {
    id: "sustainability",
    title: "Sustainable Growth",
    description:
      "Engineering technologies that contribute to resilient infrastructure and environmental responsibility.",
    icon: Leaf,
  },
  {
    id: "global",
    title: "Global Partnerships",
    description:
      "Collaborating with international partners to expand innovation beyond borders.",
    icon: Globe2,
  },
];