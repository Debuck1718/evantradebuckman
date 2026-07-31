import {
  Atom,
  BrainCircuit,
  FlaskConical,
  Globe,
  Lightbulb,
  Microscope,
  Rocket,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";

import { CompanyData } from "./types";

export const innovationCompany: CompanyData = {
    hero: {
        badge: "Innovation Center",

        title: "Creating Tomorrow's Technologies Today",

        description: "The Evantra Innovation Center explores emerging technologies, incubates transformative ideas and develops breakthrough solutions that address tomorrow's global challenges. We bridge research, engineering and entrepreneurship to create technologies with lasting impact.",

        image: "/images/companies/innovation/innovation-hero.webp",

        primaryAction: {
            label: "Explore Innovation",
            href: "#products",
        },

        secondaryAction: {
            label: "Research Programs",
            href: "#research",
        },

        metrics: [
            {
                value: "Emerging",
                label: "Technologies",
            },

            {
                value: "Innovation",
                label: "Pipeline",
            },

            {
                value: "Research",
                label: "Programs",
            },

            {
                value: "Future",
                label: "Focused",
            },
        ],
    },

    featuredShowcase: {
        badge: "Flagship Initiative",

        title: "Evantra Innovation Laboratory",

        subtitle: "Where Tomorrow's Technologies Begin",

        description: "The Evantra Innovation Laboratory transforms bold ideas into practical technologies through research, rapid prototyping, product incubation and commercialization. Every innovation begins here before evolving into products, platforms and future companies.",

        image: "/images/companies/innovation/innovation-laboratory.webp",

        primaryAction: {
            label: "Explore the Lab",
            href: "/innovation/laboratory",
        },

        secondaryAction: {
            label: "Innovation Pipeline",
            href: "#research",
        },

        metrics: [
            {
                value: "Research",
                label: "Driven",
            },

            {
                value: "Prototype",
                label: "Focused",
            },

            {
                value: "Global",
                label: "Innovation",
            },

            {
                value: "Future",
                label: "Ready",
            },
        ],

        dashboardMetrics: [
            {
                label: "Active Projects",
                value: "18",
                icon: Lightbulb,
                position: "-top-8 -left-8",
            },

            {
                label: "Research Labs",
                value: "12",
                icon: FlaskConical,
                position: "top-20 -right-8",
            },

            {
                label: "Prototype Builds",
                value: "27",
                icon: Rocket,
                position: "bottom-14 -left-8",
            },

            {
                label: "Innovation Score",
                value: "99%",
                icon: Sparkles,
                position: "-bottom-8 right-8",
            },
        ],

        highlights: [
            {
                title: "Emerging Technologies",

                description: "Exploring breakthrough technologies that have the potential to transform industries and improve lives.",

                icon: Atom,
            },

            {
                title: "Rapid Prototyping",

                description: "Turning bold concepts into functional prototypes through agile engineering and experimentation.",

                icon: Workflow,
            },

            {
                title: "Research Commercialization",

                description: "Transforming research outcomes into scalable products, platforms and new ventures.",

                icon: Microscope,
            },

            {
                title: "Global Innovation",

                description: "Building technologies with worldwide relevance through multidisciplinary collaboration and visionary thinking.",

                icon: Globe,
            },
        ],
    },

    mission: {
        title: "Transforming Ideas Into Technologies That Shape the Future",

        description: "The Evantra Innovation Center exists to discover, validate and commercialize breakthrough technologies that solve tomorrow's challenges. We believe meaningful innovation begins with bold ideas, rigorous research and relentless experimentation.",
    },

    capabilities: [
        {
            title: "Emerging Technologies",

            description: "Identifying and evaluating breakthrough technologies with the potential to transform industries, economies and society through practical innovation.",

            icon: Sparkles,

            tags: [
                "Future Tech",
                "Discovery",
                "Innovation",
                "Research",
            ],
        },

        {
            title: "Rapid Prototyping",

            description: "Accelerating the journey from concept to functional prototype using agile development, engineering expertise and iterative experimentation.",

            icon: Rocket,

            tags: [
                "Prototype",
                "MVP",
                "Validation",
                "Engineering",
            ],
        },

        {
            title: "Innovation Strategy",

            description: "Helping organizations identify future opportunities, validate ideas and develop long-term innovation roadmaps that create sustainable competitive advantages.",

            icon: Lightbulb,

            tags: [
                "Strategy",
                "Consulting",
                "Growth",
                "Innovation",
            ],
        },

        {
            title: "Technology Incubation",

            description: "Supporting the creation of next-generation products and ventures through structured incubation, mentoring and multidisciplinary collaboration.",

            icon: FlaskConical,

            tags: [
                "Incubation",
                "Startups",
                "Products",
                "Innovation",
            ],
        },

        {
            title: "Research Commercialization",

            description: "Transforming research discoveries into scalable products, platforms and commercial ventures with measurable global impact.",

            icon: Microscope,

            tags: [
                "Research",
                "Commercialization",
                "Products",
                "Technology",
            ],
        },

        {
            title: "Future Systems Design",

            description: "Designing intelligent systems that combine engineering, AI and emerging technologies to solve tomorrow's most complex challenges.",

            icon: BrainCircuit,

            tags: [
                "Systems",
                "AI",
                "Engineering",
                "Future",
            ],
        },
    ],

    solutions: [
        {
            title: "Digital Transformation",

            description: "Helping organizations adopt emerging technologies that modernize operations, improve efficiency and accelerate innovation.",

            icon: Workflow,

            tags: [
                "Transformation",
                "Innovation",
                "Technology",
                "Business",
            ],
        },

        {
            title: "Future Healthcare",

            description: "Developing innovative healthcare technologies that improve diagnostics, patient care and medical accessibility through intelligent systems.",

            icon: BrainCircuit,

            tags: [
                "Healthcare",
                "Innovation",
                "AI",
                "Research",
            ],
        },

        {
            title: "Education Innovation",

            description: "Creating intelligent learning platforms and educational technologies that transform knowledge delivery and lifelong learning.",

            icon: Lightbulb,

            tags: [
                "Education",
                "Learning",
                "Technology",
                "Innovation",
            ],
        },

        {
            title: "Climate & Sustainability",

            description: "Applying advanced technologies to address environmental challenges, improve sustainability and build resilient communities.",

            icon: Globe,

            tags: [
                "Climate",
                "Environment",
                "Sustainability",
                "Innovation",
            ],
        },

        {
            title: "Smart Communities",

            description: "Engineering future-ready communities through connected infrastructure, intelligent services and citizen-focused innovation.",

            icon: Globe,

            tags: [
                "Communities",
                "Infrastructure",
                "Innovation",
                "Technology",
            ],
        },

        {
            title: "Economic Development",

            description: "Supporting economic growth by transforming research and emerging technologies into scalable businesses and employment opportunities.",

            icon: Rocket,

            tags: [
                "Economy",
                "Growth",
                "Innovation",
                "Startups",
            ],
        },
    ],

    technologies: [
        {
            title: "Artificial Intelligence",
            name: "Artificial Intelligence",

            description: "Intelligent systems powering the next generation of innovation.",

            technologies: [
                { title: "Machine Learning" },
                { title: "Generative AI" },
                { title: "Computer Vision" },
                { title: "Natural Language Processing" },
            ],
        },

        {
            title: "Emerging Computing",

            description: "Exploring advanced computing paradigms that will shape future industries.",

            technologies: [
                { title: "Quantum Computing" },
                { title: "Edge Computing" },
                { title: "High Performance Computing" },
                { title: "Distributed Systems" },
            ],
            name: ""
        },

        {
            title: "Extended Reality",

            description: "Building immersive digital experiences through next-generation interfaces.",

            technologies: [
                { title: "Virtual Reality" },
                { title: "Augmented Reality" },
                { title: "Mixed Reality" },
                { title: "Spatial Computing" },
            ],
            name: ""
        },

        {
            title: "Connected Systems",

            description: "Powering intelligent ecosystems through connected technologies.",

            technologies: [
                { title: "Internet of Things" },
                { title: "5G Networks" },
                { title: "Digital Twins" },
                { title: "Cloud Platforms" },
            ],
            name: ""
        },

        {
            title: "Future Engineering",

            description: "Advanced engineering technologies enabling intelligent infrastructure.",

            technologies: [
                { title: "Robotics" },
                { title: "Autonomous Systems" },
                { title: "Smart Sensors" },
                { title: "Embedded Systems" },
            ],
            name: ""
        },

        {
            title: "Frontier Research",

            description: "Exploring scientific and technological frontiers that create tomorrow's breakthroughs.",

            technologies: [
                { title: "Biotechnology" },
                { title: "Blockchain" },
                { title: "Nanotechnology" },
                { title: "Space Technologies" },
            ],
            name: ""
        },
    ],
    slug: "",
    name: "",
    products: [
        {
    category: "Innovation Platform",

    title: "Evantra Innovation Laboratory",

    description:
      "A centralized innovation platform where breakthrough ideas are researched, validated and transformed into products, platforms and future companies.",

    icon: FlaskConical,

    tags: [
      "Innovation",
      "Research",
      "Incubation",
      "Technology",
    ],

    status: "Live",
  },

  {
    category: "Prototype Studio",

    title: "Rapid Prototype Studio",

    description:
      "A collaborative environment for designing, testing and validating prototypes across software, AI, engineering and emerging technologies.",

    icon: Rocket,

    tags: [
      "Prototype",
      "MVP",
      "Validation",
      "Engineering",
    ],

    status: "Live",
  },

  {
    category: "Startup Incubation",

    title: "Technology Accelerator",

    description:
      "Supporting the commercialization of innovative technologies through structured incubation, mentorship and venture development.",

    icon: Lightbulb,

    tags: [
      "Startups",
      "Acceleration",
      "Innovation",
      "Growth",
    ],

    status: "Coming Soon",
  },

  {
    category: "Research",

    title: "Future Systems Laboratory",

    description:
      "Exploring emerging technologies that will define the next generation of intelligent products and infrastructure.",

    icon: Atom,

    tags: [
      "Research",
      "Future Tech",
      "AI",
      "Engineering",
    ],

    status: "Research",
  },

  {
    category: "Collaboration",

    title: "Research Exchange Platform",

    description:
      "Connecting researchers, engineers, universities and industry partners to accelerate multidisciplinary innovation.",

    icon: Globe,

    tags: [
      "Collaboration",
      "Research",
      "Academia",
      "Industry",
    ],

    status: "In Development",
  },

  {
    category: "Commercialization",

    title: "Innovation Launch Platform",

    description:
      "Helping transition validated technologies into scalable products, companies and commercial ventures.",

    icon: Workflow,

    tags: [
      "Commercialization",
      "Products",
      "Ventures",
      "Innovation",
    ],

    status: "In Development",
  }],
    research: [
  {
    year: "2026",
    title: "Innovation Laboratory",
    description:
      "Established the Evantra Innovation Laboratory to accelerate emerging technology research and rapid prototyping.",
    icon: FlaskConical,
    tags: ["Research", "Innovation"],
  },

  {
    year: "2027+",
    title: "Future Technologies Program",
    description:
      "Expand research into frontier technologies including AI, robotics, digital twins and next-generation computing.",
    icon: Telescope,
    tags: ["Future Tech", "R&D"],
  },
],
    culture: [
  {
    title: "Curiosity First",
    description:
      "We encourage questioning assumptions and exploring bold ideas.",
    icon: Lightbulb,
    tags: ["Curiosity", "Discovery"],
  },

  {
    title: "Experimentation",
    description:
      "Rapid experimentation helps transform concepts into validated solutions.",
    icon: FlaskConical,
    tags: ["Innovation", "Learning"],
  },
],
    careers: {
  title: "Build the Future With Us",
  description:
    "Join researchers, engineers and innovators creating technologies that shape tomorrow.",
},
};

