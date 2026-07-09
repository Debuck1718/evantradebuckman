import {
  Cloud,
  Cpu,
  Factory,
  Globe,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers,
  MapPinned,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import type { CompanyData } from "./types";

export const softwareCompany: CompanyData = {
  slug: "software",

  name: "Evantra Software Center",

  hero: {
    badge: "Software Center",

    title: "Building Intelligent Digital Platforms",

    description:
      "Designing and engineering secure, scalable enterprise software, cloud infrastructure, artificial intelligence and digital platforms that accelerate digital transformation for governments, enterprises and emerging economies.",

    image: "/images/software/software-center-hero.webp",

    primaryAction: {
      label: "Explore Solutions",
      href: "#solutions",
    },

    secondaryAction: {
      label: "View Research",
      href: "#research",
    },

    metrics: [
      {
        value: "150+",
        label: "Projects",
      },
      {
        value: "40+",
        label: "Engineers",
      },
      {
        value: "99.9%",
        label: "Reliability",
      },
      {
        value: "12",
        label: "Countries",
      },
    ],
  },

  mission: {
    title: "Engineering Digital Excellence",

    description:
      "The Evantra Software Center engineers secure, intelligent and scalable digital platforms that empower governments, enterprises and communities. We transform complex challenges into innovative software solutions that create measurable impact across Africa and the global digital economy.",
  },

  capabilities: [
    {
      title: "Enterprise Software",

      description:
        "Mission-critical enterprise platforms designed for governments, institutions and large organizations.",

      icon: Layers,

      featured: true,

      tags: [
        "ERP",
        "CRM",
        "Enterprise",
      ],
    },

    {
      title: "Artificial Intelligence",

      description:
        "Practical AI systems integrated into enterprise workflows and intelligent business processes.",

      icon: Cpu,

      tags: [
        "LLMs",
        "Machine Learning",
        "Automation",
      ],
    },

    {
      title: "Cloud Infrastructure",

      description:
        "Cloud-native architecture engineered for resilience, scalability and performance.",

      icon: Cloud,

      tags: [
        "AWS",
        "Azure",
        "Containers",
      ],
    },

    {
      title: "Digital Transformation",

      description:
        "Helping organizations modernize operations through intelligent digital ecosystems.",

      icon: Globe,

      tags: [
        "Automation",
        "Business",
        "Transformation",
      ],
    },

    {
      title: "Cybersecurity Engineering",

      description:
        "Secure-by-design software built around Zero Trust architecture and modern security practices.",

      icon: ShieldCheck,

      tags: [
        "Zero Trust",
        "Security",
        "Compliance",
      ],
    },

    {
      title: "Data Engineering",

      description:
        "Designing scalable data platforms that power analytics, reporting and intelligent decision making.",

      icon: Cpu,

      tags: [
        "Analytics",
        "Data",
        "BI",
      ],
    },
  ],

  solutions: [
    {
      title: "Government Digital Platforms",

      description:
        "Modern citizen services, digital identity platforms and smart government ecosystems.",

      icon: Globe,

      tags: [
        "eGovernment",
        "Identity",
        "Public Services",
      ],
    },

    {
      title: "Healthcare Technology",

      description:
        "AI-powered healthcare platforms, telemedicine and intelligent patient engagement systems.",

      icon: HeartPulse,

      tags: [
        "Healthcare",
        "Telemedicine",
        "AI",
      ],
    },

    {
      title: "Education Technology",

      description:
        "Digital learning ecosystems, academic collaboration platforms and intelligent campus solutions.",

      icon: GraduationCap,

      tags: [
        "LMS",
        "Education",
        "Campus",
      ],
    },

    {
      title: "Financial Technology",

      description:
        "Secure digital banking, payment systems and enterprise financial platforms.",

      icon: Landmark,

      tags: [
        "FinTech",
        "Payments",
        "Security",
      ],
    },

    {
      title: "Commerce Platforms",

      description:
        "Enterprise commerce, logistics, inventory and supply-chain management platforms.",

      icon: ShoppingBag,

      tags: [
        "ERP",
        "Commerce",
        "Supply Chain",
      ],
    },

    {
      title: "Industrial Automation",

      description:
        "Industry 4.0 solutions powered by IoT, predictive analytics and intelligent automation.",

      icon: Factory,

      tags: [
        "IoT",
        "Automation",
        "Industry 4.0",
      ],
    },
  ],

  technologies: [
    {
      title: "Frontend Engineering",

      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "React Native",
      ],
    },

    {
      title: "Backend & APIs",

      technologies: [
        "Node.js",
        "Express.js",
        "REST API",
        "GraphQL",
      ],
    },

    {
      title: "Cloud & Infrastructure",

      technologies: [
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "Supabase",
      ],
    },

    {
      title: "Artificial Intelligence",

      technologies: [
        "OpenAI",
        "LangChain",
        "RAG",
        "Machine Learning",
      ],
    },

    {
      title: "Data Engineering",

      technologies: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
      ],
    },

    {
      title: "Security & DevSecOps",

      technologies: [
        "JWT",
        "OAuth",
        "Zero Trust",
        "CI/CD",
      ],
    },
  ],
    products: [
    {
      category: "Education Platform",

      title: "EvantraHub",

      status: "In Development",

      description:
        "A comprehensive academic platform that centralizes course slides, educational resources, past examination questions, academic discussions and institutional announcements while empowering course representatives to manage and share learning materials through one unified learning ecosystem.",

      icon: Globe,

      featured: true,

      tags: [
        "Course Slides",
        "Resource Library",
        "Past Questions",
        "Academic Forum",
        "Announcements",
      ],
    },

    {
      category: "Commerce Platform",

      title: "StoreForge",

      status: "In Development",

      description:
        "A multi-tenant enterprise commerce platform enabling organizations to launch secure, scalable online storefronts with integrated inventory, analytics, payment processing and operational management.",

      icon: ShoppingBag,

      featured: true,

      tags: [
        "Multi-Tenant",
        "Commerce",
        "SaaS",
      ],
    },

    {
      category: "Digital Healthcare",

      title: "LabReport AI",

      status: "In Development",

      description:
        "An AI-powered digital healthcare platform combining intelligent laboratory report interpretation, an AI health assistant, multilingual support, secure patient-doctor communication, voice and video consultations, verified healthcare professionals, hospital adoption, report sharing and collaborative patient care within one connected healthcare ecosystem.",

      icon: HeartPulse,

      featured: true,

      tags: [
        "Artificial Intelligence",
        "Healthcare",
        "Telemedicine",
        "Hospitals",
        "Multilingual",
      ],
    },

    {
      category: "Student Productivity",

      title: "SmartStudent",

      status: "In Development",

      description:
        "An intelligent student productivity platform designed to help learners manage assignments, budgets, academic planning, collaboration, personal goals and educational success through one connected workspace.",

      icon: GraduationCap,

      tags: [
        "Education",
        "Students",
        "Productivity",
      ],
    },

    {
      category: "Infrastructure",

      title: "Campus Navigator Engine",

      status: "Research",

      description:
        "A reusable interactive navigation engine powering immersive digital campus experiences, enterprise wayfinding and intelligent location services for universities and organizations.",

      icon: MapPinned,

      tags: [
        "Campus",
        "Navigation",
        "Maps",
      ],
    },

    {
      category: "AI Governance",

      title: "Security-by-Ethics",

      status: "Research",

      description:
        "A practical AI governance framework helping organizations evaluate artificial intelligence systems for transparency, fairness, explainability, security and responsible deployment.",

      icon: ShieldCheck,

      tags: [
        "AI",
        "Governance",
        "Ethics",
      ],
    },
  ],

  research: [
    {
      year: "2026",

      title: "Software Center Established",

      description:
        "Launch of the Evantra Software Center as the engineering foundation for the Evantra ecosystem.",
    },

    {
      year: "2026",

      title: "LabReport AI",

      description:
        "Development of an AI-powered healthcare ecosystem integrating intelligent report interpretation, multilingual assistance and secure patient-doctor collaboration.",
    },

    {
      year: "2026",

      title: "StoreForge",

      description:
        "Research and engineering of a scalable multi-tenant commerce platform for modern digital businesses.",
    },

    {
      year: "2026",

      title: "EvantraHub",

      description:
        "Expansion of a comprehensive academic ecosystem supporting course resources, collaboration and institutional learning.",
    },

    {
      year: "Future",

      title: "Next Generation Platforms",

      description:
        "Continued research into artificial intelligence, cloud computing, enterprise software and digital transformation technologies.",
    },
  ],

  culture: [
    {
      title: "Innovation First",

      description:
        "We encourage curiosity, experimentation and continuous innovation to solve meaningful real-world challenges.",

      icon: Cpu,

      tags: [
        "Innovation",
        "Research",
      ],
    },

    {
      title: "Engineering Excellence",

      description:
        "Quality, maintainability and modern engineering practices are embedded into every product we build.",

      icon: Layers,

      tags: [
        "Architecture",
        "Quality",
      ],
    },

    {
      title: "Security by Design",

      description:
        "Security is integrated into every stage of software engineering rather than added as an afterthought.",

      icon: ShieldCheck,

      tags: [
        "Security",
        "Zero Trust",
      ],
    },

    {
      title: "People-Centered Technology",

      description:
        "Technology should simplify lives, empower organizations and create measurable social and economic impact.",

      icon: HeartPulse,

      tags: [
        "People",
        "Impact",
      ],
    },
  ],

  careers: {
    title: "Build the Future With Us",

    description:
      "Join our multidisciplinary engineering teams as we design secure, intelligent and scalable digital platforms that transform industries across Africa and the global digital economy.",
  },
};
