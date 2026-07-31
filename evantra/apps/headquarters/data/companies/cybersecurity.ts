import {
  ShieldCheck,
  Lock,
  Fingerprint,
  ScanSearch,
  CloudCog,
  BrainCircuit,
  Building2,
  Landmark,
  HeartPulse,
  Factory,
  Banknote,
  Server,
  Shield,
  Eye,
  Network,
  KeyRound,
  Bot,
  Globe2,
  Users,
  GraduationCap,
} from "lucide-react";

import type { CompanyData } from "./types";

export const cybersecurityCompany: CompanyData = {
  slug: "cybersecurity",

  name: "Cybersecurity Center",

  hero: {
    badge: "Cybersecurity Center",

    title: "Engineering Secure Digital Ecosystems for a Connected World",

    description: "The Evantra Cybersecurity Center engineers resilient digital systems through secure software development, Zero Trust architecture, cloud security and intelligent cyber defense. We help governments, enterprises and innovators build technologies people can trust.",

    image: "/images/campus/cybersecurity-center.webp",

    primaryAction: {
      label: "Explore Security Solutions",
      href: "#solutions",
    },

    secondaryAction: {
      label: "View Security Research",
      href: "#research",
    },

    metrics: [
      {
        value: "Zero Trust",
        label: "Architecture",
      },
      {
        value: "24/7",
        label: "Security Readiness",
      },
      {
        value: "Enterprise",
        label: "Protection",
      },
      {
        value: "AI",
        label: "Threat Detection",
      },
    ],
  },

  mission: {
    title: "Security Built Into Every Layer",

    description: "At Evantra, cybersecurity is never an afterthought. We engineer secure software, resilient cloud platforms and intelligent defense systems from the ground up using Zero Trust principles, proactive monitoring and responsible security engineering.",
  },

  capabilities: [
    {
      title: "Secure Software Engineering",
      description: "Building secure applications using modern secure development lifecycle practices.",
      icon: ShieldCheck,
      tags: ["Secure SDLC", "Code Review", "DevSecOps"],
      featured: true,
    },

    {
      title: "Zero Trust Architecture",
      description: "Designing systems where every identity, device and workload is continuously verified.",
      icon: Lock,
      tags: ["ZTNA", "Least Privilege", "Identity"],
    },

    {
      title: "Cloud Security",
      description: "Protecting cloud-native platforms through automation, monitoring and policy enforcement.",
      icon: CloudCog,
      tags: ["AWS", "Azure", "Containers"],
    },

    {
      title: "Threat Intelligence",
      description: "Detecting emerging cyber threats using intelligence-driven security operations.",
      icon: Eye,
      tags: ["SOC", "Threat Hunting", "Monitoring"],
    },

    {
      title: "Identity & Access Management",
      description: "Engineering identity systems that protect enterprise users and services.",
      icon: Fingerprint,
      tags: ["IAM", "SSO", "MFA"],
    },

    {
      title: "AI Security",
      description: "Protecting AI systems from adversarial attacks while ensuring trustworthy deployment.",
      icon: BrainCircuit,
      tags: ["LLMs", "Model Security", "Responsible AI"],
    },
  ],

  solutions: [
    {
      title: "Government Security",
      description: "Securing public-sector digital infrastructure and citizen platforms.",
      icon: Landmark,
      tags: ["Identity", "Compliance"],
    },

    {
      title: "Healthcare Security",
      description: "Protecting sensitive healthcare systems, medical platforms and patient data.",
      icon: HeartPulse,
      tags: ["HIPAA", "Medical AI"],
    },

    {
      title: "Financial Security",
      description: "Engineering secure fintech platforms and digital payment ecosystems.",
      icon: Banknote,
      tags: ["Fraud", "Payments"],
    },

    {
      title: "Enterprise Protection",
      description: "Building enterprise security strategies for modern organizations.",
      icon: Building2,
      tags: ["IAM", "Cloud", "Governance"],
    },

    {
      title: "Industrial Security",
      description: "Securing connected infrastructure and operational technology environments.",
      icon: Factory,
      tags: ["OT", "IoT"],
    },

    {
      title: "Cloud Infrastructure Security",
      description: "Defending cloud platforms through continuous monitoring and automated response.",
      icon: Server,
      tags: ["Cloud", "DevSecOps"],
    },
  ],

  technologies: [
    {
      title: "Identity & Access",
      technologies: [
        { title: "OAuth" },
        { title: "OpenID Connect" },
        { title: "MFA" },
        { title: "RBAC" },
        { title: "SSO" },
      ],
      name: ""
    },
    {
      title: "Application Security",
      technologies: [
        { title: "OWASP" },
        { title: "Secure SDLC" },
        { title: "Static Analysis" },
        { title: "Dynamic Testing" },
      ],
      name: ""
    },
    {
      title: "Cloud Security",
      technologies: [
        { title: "AWS Security" },
        { title: "Azure" },
        { title: "Docker" },
        { title: "Kubernetes" },
      ],
      name: ""
    },
    {
      title: "Threat Detection",
      technologies: [
        { title: "SIEM" },
        { title: "Threat Intelligence" },
        { title: "SOC" },
        { title: "Incident Response" },
      ],
      name: ""
    },
    {
      title: "Infrastructure Security",
      technologies: [
        { title: "Firewalls" },
        { title: "Network Segmentation" },
        { title: "VPN" },
        { title: "Zero Trust" },
      ],
      name: ""
    },
    {
      title: "AI Security",
      technologies: [
        { title: "Model Security" },
        { title: "Prompt Protection" },
        { title: "LLM Safety" },
        { title: "Responsible AI" },
      ],
      name: ""
    },
  ],

  products: [
    {
      title: "Security-by-Ethics Framework",
      category: "Governance",
      description: "A practical framework for evaluating AI systems through ethics, security and transparency.",
      icon: Shield,
      status: "Research",
    },

    {
      title: "Evantra Identity Platform",
      category: "Identity",
      description: "Unified identity and authentication platform for the Evantra ecosystem.",
      icon: KeyRound,
      status: "In Development",
    },

    {
      title: "Threat Intelligence Portal",
      category: "Security Operations",
      description: "Centralized monitoring and cyber threat intelligence dashboard.",
      icon: ScanSearch,
      status: "Coming Soon",
    },

    {
      title: "AI Threat Monitor",
      category: "Artificial Intelligence",
      description: "AI-powered security monitoring and anomaly detection platform.",
      icon: Bot,
      status: "Research",
    },
  ],

  research: [
    {
      year: "2026",
      title: "Security-by-Ethics Framework",
      description: "Development of a governance framework integrating cybersecurity, explainability and ethical AI.",
      icon: Shield,
      tags: ["AI", "Governance"],
    },

    {
      year: "2027",
      title: "Zero Trust Research",
      description: "Research into scalable Zero Trust architectures for enterprises and governments.",
      icon: Lock,
      tags: ["Zero Trust"],
    },

    {
      year: "Future",
      title: "AI Security Laboratory",
      description: "Applied research into AI security, adversarial machine learning and trustworthy autonomous systems.",
      icon: BrainCircuit,
      tags: ["AI Security"],
    },

    {
      year: "Future",
      title: "African Cybersecurity Initiative",
      description: "Collaborative cybersecurity research supporting resilient digital infrastructure across Africa.",
      icon: Globe2,
      tags: ["Africa"],
    },
  ],

  culture: [
    {
      title: "Security First",
      description: "Every engineering decision begins with protecting people, systems and data.",
      icon: Shield,
      tags: ["Trust", "Resilience"],
    },

    {
      title: "Continuous Learning",
      description: "Cybersecurity evolves daily, and so do we through research and continuous improvement.",
      icon: GraduationCap,
      tags: ["Growth"],
    },

    {
      title: "Engineering Excellence",
      description: "We engineer secure systems with precision, discipline and long-term thinking.",
      icon: Network,
      tags: ["Quality"],
    },

    {
      title: "Collaborative Defense",
      description: "Security is strongest when engineers, researchers and organizations work together.",
      icon: Users,
      tags: ["Teamwork"],
    },
  ],

  careers: {
    title: "Protect Tomorrow's Digital World",

    description: "Join a multidisciplinary engineering team building secure digital infrastructure, AI security platforms and resilient technologies that empower organizations worldwide.",
  },

  featuredShowcase: {
    badge: "Security Innovation",
    title: "Zero Trust Security Platform",
    subtitle: "Enterprise Security",
    description: "Our comprehensive Zero Trust architecture platform that secures every identity, device and workload with continuous verification and intelligent threat detection.",
    image: "/images/products/zero-trust-platform.webp",
    highlights: [
      {
        title: "Continuous Verification",
        description: "Every access request is verified in real-time",
        icon: ShieldCheck,
      },
      {
        title: "Threat Detection",
        description: "AI-powered detection of emerging cyber threats",
        icon: Eye,
      },
      {
        title: "Identity Protection",
        description: "Enterprise-grade identity and access management",
        icon: Fingerprint,
      },
    ],
  }
};