import {
  Activity,
  Bot,
  BrainCircuit,
  Building2,
  Cpu,
  Drone,
  Factory,
  Radar,
  Radio,
  Route,
} from "lucide-react";

import { CompanyData } from "./types";

// Helper to satisfy older/incorrect typings where `tags` is expected to be a function
const castTags = <T extends readonly string[]>(t: T) => t as unknown as (tags: any) => unknown;

export const engineeringCompany: CompanyData = {
  hero: {
    badge: "Engineering Center",

    title: "Engineering Intelligent Systems for the Physical World",

    description:
      "The Evantra Engineering Center designs autonomous systems, robotics, industrial IoT, intelligent infrastructure and advanced engineering technologies that bridge software with the physical world. We engineer resilient, scalable and sustainable systems that improve industries, communities and everyday life.",

    image: "/images/companies/engineering/engineering-hero.webp",

    primaryAction: {
      label: "Explore Engineering",
      href: "#products",
    },

    secondaryAction: {
      label: "Research",
      href: "#research",
    },

    metrics: [
      {
        value: "Autonomous",
        label: "Systems",
      },

      {
        value: "Industrial",
        label: "Engineering",
      },

      {
        value: "IoT",
        label: "Infrastructure",
      },

      {
        value: "Future",
        label: "Focused",
      },
    ],
  },

  featuredShowcase: {
    badge: "Flagship Initiative",

    title: "Autonomous Systems Initiative",

    subtitle: "Engineering the Future of Intelligent Infrastructure",

    description:
      "The Autonomous Systems Initiative represents Evantra's long-term vision for intelligent robotics, autonomous mobility, industrial automation and connected infrastructure. It combines artificial intelligence, embedded engineering, computer vision and IoT to build practical systems capable of solving real-world engineering challenges.",

    image:
      "/images/companies/engineering/autonomous-systems-dashboard.webp",

    primaryAction: {
      label: "Explore Initiative",
      href: "/engineering/autonomous-systems",
    },

    secondaryAction: {
      label: "Research Projects",
      href: "#research",
    },

    metrics: [
      {
        value: "Autonomous",
        label: "Engineering",
      },

      {
        value: "AI",
        label: "Navigation",
      },

      {
        value: "Smart",
        label: "Infrastructure",
      },

      {
        value: "Industrial",
        label: "IoT",
      },
    ],

    dashboardMetrics: [
      {
        label: "Fleet Status",
        value: "24 Active",
        icon: Drone,
        position: "-top-8 -left-8",
      },

      {
        label: "Sensor Nodes",
        value: "156",
        icon: Radar,
        position: "top-20 -right-8",
      },

      {
        label: "Routes",
        value: "42",
        icon: Route,
        position: "bottom-14 -left-8",
      },

      {
        label: "Automation",
        value: "98%",
        icon: Activity,
        position: "-bottom-8 right-8",
      },
    ],

    highlights: [
      {
        title: "Autonomous Navigation",

        description:
          "Developing intelligent navigation systems for autonomous vehicles, drones and robotic platforms.",

        icon: Drone,
      },

      {
        title: "Industrial IoT",

        description:
          "Building connected sensor ecosystems that enable intelligent monitoring and automation.",

        icon: Radio,
      },

      {
        title: "Embedded Intelligence",

        description:
          "Engineering embedded systems capable of processing data and making intelligent decisions at the edge.",

        icon: Cpu,
      },

      {
        title: "Robotics Engineering",

        description:
          "Designing intelligent robotic platforms for logistics, manufacturing, monitoring and future autonomous applications.",

        icon: Bot,
      },
    ],
  },

  mission: {
    title:
      "Engineering Intelligent Infrastructure for a Better Future",

    description:
      "The Evantra Engineering Center exists to create intelligent engineering systems that solve real-world challenges through robotics, autonomous systems, embedded technologies and industrial innovation. We believe engineering should improve lives by making infrastructure smarter, safer and more sustainable.",
  },

  capabilities: [
  {
    title: "Autonomous Systems",

    description:
      "Designing intelligent autonomous systems capable of perception, navigation, decision-making and real-world operation across logistics, transportation and industrial environments.",

    icon: Drone,

    tags: [
      "Autonomous Vehicles",
      "Navigation",
      "AI",
      "Control Systems",
    ],
  },

  {
    title: "Robotics Engineering",

    description:
      "Engineering robotic platforms that combine mechanical systems, embedded computing and artificial intelligence to automate complex physical tasks safely and efficiently.",

    icon: Bot,

    tags: [
      "Robotics",
      "Automation",
      "Industrial",
      "Control",
    ],
  },

  {
    title: "Industrial IoT",

    description:
      "Building connected sensor ecosystems that collect, analyze and exchange operational data to improve industrial efficiency, safety and predictive maintenance.",

    icon: Radio,

    tags: [
      "IoT",
      "Sensors",
      "Connectivity",
      "Monitoring",
    ],
  },

  {
    title: "Embedded Systems",

    description:
      "Developing embedded hardware and firmware that power intelligent devices operating reliably in real-time environments.",

    icon: Cpu,

    tags: [
      "Embedded",
      "Firmware",
      "Microcontrollers",
      "Edge Computing",
    ],
  },

  {
    title: "Computer Vision",

    description:
      "Applying computer vision and intelligent perception systems to enable machines to understand and interact with their physical surroundings.",

    icon: BrainCircuit,

    tags: [
      "OpenCV",
      "Vision AI",
      "Detection",
      "Recognition",
    ],
  },

  {
    title: "Smart Infrastructure",

    description:
      "Engineering intelligent infrastructure capable of monitoring, adapting and responding to changing operational conditions using connected technologies.",

    icon: Building2,

    tags: [
      "Infrastructure",
      "Smart Cities",
      "Automation",
      "Engineering",
    ],
  },
],

solutions: [
  {
    title: "Drone Logistics",

    description:
      "Autonomous aerial delivery systems designed to improve logistics efficiency, reduce delivery times and expand access to remote communities.",

    icon: Drone,

    tags: [
      "Logistics",
      "Delivery",
      "Autonomous",
      "Fleet",
    ],
  },

  {
    title: "Industrial Automation",

    description:
      "Intelligent automation solutions that streamline manufacturing processes, improve operational efficiency and reduce manual intervention.",

    icon: Factory,

    tags: [
      "Automation",
      "Manufacturing",
      "Industrial",
      "AI",
    ],
  },

  {
    title: "Smart Agriculture",

    description:
      "Precision agriculture technologies using connected sensors, autonomous systems and analytics to improve crop productivity and sustainability.",

    icon: Radar,

    tags: [
      "Agriculture",
      "Sensors",
      "Precision Farming",
      "IoT",
    ],
  },

  {
    title: "Environmental Monitoring",

    description:
      "Real-time environmental intelligence platforms that monitor air quality, water resources, weather conditions and ecosystem health.",

    icon: Activity,

    tags: [
      "Environment",
      "Monitoring",
      "Analytics",
      "Sensors",
    ],
  },

  {
    title: "Smart Cities",

    description:
      "Engineering connected urban infrastructure that improves transportation, utilities, safety and public services through intelligent technologies.",

    icon: Building2,

    tags: [
      "Smart Cities",
      "Infrastructure",
      "Urban Technology",
      "IoT",
    ],
  },

  {
    title: "Critical Infrastructure",

    description:
      "Secure engineering solutions supporting energy, transportation, communications and public infrastructure through intelligent monitoring and automation.",

    icon: Cpu,

    tags: [
      "Infrastructure",
      "Security",
      "Engineering",
      "Operations",
    ],
  },
],

technologies: [
  {
    name: "robotics",
    title: "Robotics",
    technologies: [
      { title: "ROS 2" },
      { title: "Gazebo" },
      { title: "MoveIt" },
      { title: "OpenCV" },
    ],
  },

  {
    name: "embedded-systems",
    title: "Embedded Systems",
    technologies: [
      { title: "ESP32" },
      { title: "Arduino" },
      { title: "STM32" },
      { title: "Raspberry Pi" },
    ],
  },

  {
    name: "artificial-intelligence",
    title: "Artificial Intelligence",
    technologies: [
      { title: "TensorRT" },
      { title: "CUDA" },
      { title: "PyTorch" },
      { title: "ONNX" },
    ],
  },

  {
    name: "connectivity",
    title: "Connectivity",
    technologies: [
      { title: "MQTT" },
      { title: "LoRaWAN" },
      { title: "5G" },
      { title: "Edge Networking" },
    ],
  },

  {
    name: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    technologies: [
      { title: "Docker" },
      { title: "Kubernetes" },
      { title: "Edge AI" },
      { title: "Cloud Computing" },
    ],
  },

  {
    name: "engineering-tools",
    title: "Engineering Tools",
    technologies: [
      { title: "Fusion 360" },
      { title: "SolidWorks" },
      { title: "KiCad" },
      { title: "MATLAB" },
    ],
  },
],

products: [
  {
    category: "Autonomous Systems",

    title: "Autonomous Systems Platform",

    description:
      "A modular engineering platform that integrates robotics, artificial intelligence, computer vision and embedded technologies to power autonomous operations across multiple industries.",

    icon: Drone,

    tags: [
      "Autonomous",
      "Robotics",
      "AI",
      "Industrial",
    ],

    status: "In Development",
  },

  {
    category: "Fleet Management",

    title: "Drone Fleet Manager",

    description:
      "A centralized platform for monitoring autonomous drones, managing missions, optimizing routes and tracking operational performance in real time.",

    icon: Route,

    tags: [
      "Fleet",
      "Navigation",
      "Telemetry",
      "Operations",
    ],

    status: "Research",
  },

  {
    category: "Industrial IoT",

    title: "Industrial Edge Platform",

    description:
      "Edge computing infrastructure that processes sensor data locally, enabling low-latency automation and intelligent industrial decision-making.",

    icon: Cpu,

    tags: [
      "Edge AI",
      "Industrial",
      "IoT",
      "Automation",
    ],

    status: "Coming Soon",
  },

  {
    category: "Robotics",

    title: "Robotics Control Center",

    description:
      "An intelligent command platform for monitoring robotic systems, scheduling tasks and coordinating autonomous engineering operations.",

    icon: Bot,

    tags: [
      "Robotics",
      "Automation",
      "Monitoring",
      "Control",
    ],

    status: "Research",
  },

  {
    category: "Environmental Intelligence",

    title: "Environmental Intelligence Suite",

    description:
      "Integrated monitoring technologies that collect environmental data and provide predictive insights for sustainability, infrastructure and public safety.",

    icon: Radar,

    tags: [
      "Environment",
      "Analytics",
      "Sensors",
      "Sustainability",
    ],

    status: "Coming Soon",
  },

  {
    category: "Smart Infrastructure",

    title: "Smart Sensor Network",

    description:
      "Connected sensor infrastructure providing real-time visibility into buildings, transportation systems, utilities and critical engineering assets.",

    icon: Radio,

    tags: [
      "Sensors",
      "IoT",
      "Infrastructure",
      "Monitoring",
    ],

    status: "Coming Soon",
  },
],

research: [
  {
      title: "Autonomous Navigation",

      description: "Researching perception, localization and navigation technologies for autonomous drones, robotic systems and intelligent vehicles.",

      icon: Drone,

      tags: [
          "Navigation",
          "AI",
          "Robotics",
      ],
      year: ""
  },

  {
      title: "Human–Robot Collaboration",

      description: "Exploring intelligent collaboration between humans and robotic systems to improve safety, productivity and operational efficiency.",

      icon: Bot,

      tags: [
          "Robotics",
          "Automation",
          "Research",
      ],
      year: ""
  },

  {
      title: "Industrial Edge Intelligence",

      description: "Developing distributed edge intelligence platforms capable of processing engineering data close to its source for faster decision-making.",

      icon: Cpu,

      tags: [
          "Edge AI",
          "Industrial IoT",
          "Analytics",
      ],
      year: ""
  },

  {
      title: "Smart Infrastructure",

      description: "Building engineering technologies that create safer, more connected and more resilient infrastructure for future communities.",

      icon: Building2,

      tags: [
          "Infrastructure",
          "Cities",
          "Innovation",
      ],
      year: ""
  },
],

culture: [
  {
    title: "Engineering Excellence",

    description:
      "We pursue precision, reliability and technical excellence in every engineering system we design, prototype and deploy.",

    icon: Cpu,

    tags: [
      "Precision",
      "Quality",
      "Reliability",
    ],
  },

  {
    title: "Innovation Through Engineering",

    description:
      "We continuously explore emerging engineering technologies to solve real-world challenges with practical and scalable solutions.",

    icon: BrainCircuit,

    tags: [
      "Innovation",
      "Research",
      "Technology",
    ],
  },

  {
    title: "Safety by Design",

    description:
      "Safety is integrated into every engineering decision, ensuring autonomous and intelligent systems operate responsibly and reliably.",

    icon: Activity,

    tags: [
      "Safety",
      "Engineering",
      "Standards",
    ],
  },

  {
    title: "Collaborative Engineering",

    description:
      "We believe the best engineering solutions emerge through multidisciplinary collaboration across software, electronics, mechanical systems and artificial intelligence.",

    icon: Building2,

    tags: [
      "Teamwork",
      "Systems",
      "Engineering",
    ],
  },

  {
    title: "Sustainable Infrastructure",

    description:
      "Our engineering solutions are designed to improve efficiency while supporting environmental sustainability and responsible resource utilization.",

    icon: Factory,

    tags: [
      "Sustainability",
      "Infrastructure",
      "Future",
    ],
  },

  {
    title: "Continuous Learning",

    description:
      "Engineering evolves rapidly, and we foster a culture of experimentation, research and lifelong technical learning.",

    icon: BrainCircuit,

    tags: [
      "Learning",
      "Growth",
      "Innovation",
    ],
  },
],

careers: {
  title: "Engineer the Technologies of Tomorrow",

  description:
    "Join robotics engineers, embedded systems specialists, AI researchers and multidisciplinary innovators building intelligent engineering systems that transform industries and improve lives.",
},

slug: "engineering",

name: "Engineering Center",

};