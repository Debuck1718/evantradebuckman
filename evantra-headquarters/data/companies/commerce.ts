import {
  BarChart3,
  Building2,
  CreditCard,
  Globe2,
  Package,
  ShoppingBag,
  Store,
  Truck,
  Wallet,
  Warehouse,
} from "lucide-react";

import { CompanyData, CompanyTimelineItem } from "./types";

export const commerceCompany: CompanyData = {
  hero: {
    badge: "Commerce Center",

    title: "Engineering the Future of Digital Commerce",

    description:
      "The Evantra Commerce Center develops enterprise-grade commerce technologies that enable businesses to launch, operate and scale secure digital commerce ecosystems. From multi-tenant storefronts and intelligent inventory systems to payment infrastructure and AI-powered business analytics, we engineer platforms that help organizations succeed in the modern digital economy.",

    image: "/images/companies/commerce/commerce-hero.webp",

    primaryAction: {
      label: "Explore StoreForge",
      href: "#products",
    },

    secondaryAction: {
      label: "Commerce Solutions",
      href: "#solutions",
    },

    metrics: [
      {
        value: "Enterprise",
        label: "Commerce",
      },

      {
        value: "Multi-Tenant",
        label: "Platform",
      },

      {
        value: "AI",
        label: "Powered",
      },

      {
        value: "Global",
        label: "Business Ready",
      },
    ],
  },

  featuredShowcase: {
    badge: "Flagship Platform",

    title: "StoreForge",

    subtitle: "Enterprise Commerce Platform",

    description:
      "StoreForge is Evantra's flagship commerce platform built for entrepreneurs, retailers and enterprises. It provides everything needed to launch, manage and scale modern online businesses—from storefront management and inventory to payments, analytics and AI-powered commerce intelligence.",

    image:
      "/images/companies/commerce/storeforge-dashboard.webp",

    primaryAction: {
      label: "Explore StoreForge",
      href: "/products/storeforge",
    },

    secondaryAction: {
      label: "View Platform",
      href: "#products",
    },

    metrics: [
      {
        value: "Enterprise",
        label: "Commerce Platform",
      },

      {
        value: "AI",
        label: "Business Intelligence",
      },

      {
        value: "Secure",
        label: "Payments",
      },

      {
        value: "Global",
        label: "Infrastructure",
      },
    ],

    dashboardMetrics: [
      {
        label: "Revenue",
        value: "+18%",
        icon: BarChart3,
        position: "-top-8 -left-8",
      },

      {
        label: "Orders",
        value: "2,381",
        icon: ShoppingBag,
        position: "top-20 -right-8",
      },

      {
        label: "Products",
        value: "542",
        icon: Package,
        position: "bottom-14 -left-8",
      },

      {
        label: "Customers",
        value: "14K",
        icon: Building2,
        position: "-bottom-8 right-8",
      },
    ],

    highlights: [
      {
        title: "Multi-Tenant Commerce",

        description:
          "Launch and manage multiple branded storefronts from one powerful platform.",

        icon: Store,
      },

      {
        title: "Integrated Payments",

        description:
          "Support local and international payment gateways with enterprise-grade security.",

        icon: CreditCard,
      },

      {
        title: "Inventory Intelligence",

        description:
          "Track products, warehouses and fulfillment in real time using intelligent inventory management.",

        icon: Warehouse,
      },

      {
        title: "Business Analytics",

        description:
          "Gain actionable insights through AI-powered dashboards, reporting and predictive analytics.",

        icon: BarChart3,
      },
    ],
  },

  mission: {
    title: "Building Commerce Infrastructure for a Digital Economy",

    description:
      "The Evantra Commerce Center exists to empower entrepreneurs, businesses and institutions with secure, intelligent and scalable commerce technologies. We believe digital commerce should be accessible, efficient and globally connected, enabling organizations of every size to participate confidently in the modern economy.",
  },

  capabilities: [
    {
        title: "Enterprise Commerce Platforms",

        description:
            "Engineering scalable multi-tenant commerce platforms that enable entrepreneurs, retailers and enterprises to launch, manage and grow digital businesses from a unified infrastructure.",

        icon: Store,

        tags: [
            "StoreForge",
            "Multi-Tenant",
            "SaaS",
            "Enterprise",
        ],
    },

    {
        title: "Digital Payment Infrastructure",

        description:
            "Building secure payment ecosystems supporting online payments, subscriptions, invoicing, mobile money, banking integrations and international payment gateways.",

        icon: CreditCard,

        tags: [
            "Paystack",
            "Flutterwave",
            "Subscriptions",
            "Billing",
        ],
    },

    {
        title: "Inventory & Supply Chain",

        description:
            "Developing intelligent inventory, warehouse and fulfillment solutions that provide real-time stock visibility, automated replenishment and logistics integration.",

        icon: Warehouse,

        tags: [
            "Inventory",
            "Warehouse",
            "Fulfillment",
            "Logistics",
        ],
    },

    {
        title: "Commerce Intelligence",

        description:
            "Applying artificial intelligence and advanced analytics to understand customer behavior, predict trends and optimize business performance.",

        icon: BarChart3,

        tags: [
            "AI",
            "Analytics",
            "Forecasting",
            "Insights",
        ],
    },

    {
        title: "Marketplace Infrastructure",

        description:
            "Building scalable digital marketplaces connecting merchants, suppliers and customers through secure, high-performance commerce ecosystems.",

        icon: ShoppingBag,

        tags: [
            "Marketplace",
            "Vendors",
            "Orders",
            "Customers",
        ],
    },

    {
        title: "Global Commerce Solutions",

        description:
            "Designing commerce infrastructure capable of supporting international expansion through localization, taxation, currencies and multilingual storefront experiences.",

        icon: Globe2,

        tags: [
            "International",
            "Localization",
            "Multi-Currency",
            "Global",
        ],
    },
],

solutions: [
    {
        title: "Retail Commerce",

        description:
            "Modern digital storefronts that enable retailers to sell products online while managing inventory, payments and customer engagement from one platform.",

        icon: Store,

        tags: [
            "Retail",
            "E-Commerce",
            "Storefront",
            "POS",
        ],
    },

    {
        title: "B2B Commerce",

        description:
            "Enterprise procurement, wholesale ordering, account management and contract pricing solutions designed for business-to-business commerce.",

        icon: Building2,

        tags: [
            "Wholesale",
            "Procurement",
            "Enterprise",
            "B2B",
        ],
    },

    {
        title: "Marketplace Platforms",

        description:
            "Digital marketplace ecosystems allowing multiple merchants to sell products and services within a unified commerce environment.",

        icon: ShoppingBag,

        tags: [
            "Marketplace",
            "Multi-Vendor",
            "Digital Economy",
            "Commerce",
        ],
    },

    {
        title: "Payment Solutions",

        description:
            "Secure payment processing, subscription billing, invoicing and financial transaction management for modern businesses.",

        icon: Wallet,

        tags: [
            "Payments",
            "Billing",
            "Invoices",
            "Subscriptions",
        ],
    },

    {
        title: "Logistics & Fulfillment",

        description:
            "Integrated logistics systems supporting order fulfillment, shipping coordination, warehouse management and delivery optimization.",

        icon: Truck,

        tags: [
            "Shipping",
            "Warehousing",
            "Fulfillment",
            "Logistics",
        ],
    },

    {
        title: "Business Analytics",

        description:
            "Comprehensive dashboards and reporting platforms that provide organizations with actionable insights into sales, customers, inventory and financial performance.",

        icon: BarChart3,

        tags: [
            "Analytics",
            "KPIs",
            "Reporting",
            "Business Intelligence",
        ],
    },
],

technologies: [
    {
        name: "frontend",
        title: "Frontend",

        technologies: [
            { title: "Next.js" },
            { title: "React" },
            { title: "TypeScript" },
            { title: "Tailwind CSS" },
        ],
    },

    {
        name: "backend",
        title: "Backend",

        technologies: [
            { title: "Node.js" },
            { title: "Express.js" },
            { title: "Supabase" },
            { title: "PostgreSQL" },
        ],
    },

    {
        name: "payments",
        title: "Payments",

        technologies: [
            { title: "Paystack" },
            { title: "Flutterwave" },
            { title: "Stripe" },
        ],
    },

    {
        name: "cloud-infrastructure",
        title: "Cloud Infrastructure",

        technologies: [
            { title: "Docker" },
            { title: "Redis" },
            { title: "Cloudflare" },
            { title: "Vercel" },
        ],
    },

    {
        name: "commerce-intelligence",
        title: "Commerce Intelligence",

        technologies: [
            { title: "OpenAI" },
            { title: "Vector Search" },
            { title: "Business Analytics" },
            { title: "Recommendation Engine" },
        ],
    },

    {
        name: "developer-ecosystem",
        title: "Developer Ecosystem",

        technologies: [
            { title: "REST API" },
            { title: "Webhooks" },
            { title: "SDKs" },
            { title: "OAuth" },
        ],
    },
],

products: [
    {
        category: "Commerce Platform",

        title: "StoreForge",

        description:
            "A modern multi-tenant enterprise commerce platform enabling businesses to launch, operate and scale online stores with integrated inventory, payments, analytics and AI-powered business intelligence.",

        icon: Store,

        tags: [
            "Flagship",
            "Multi-Tenant",
            "E-Commerce",
            "Enterprise",
            "SaaS",
        ],

        status: "In Development",
    },

    {
        category: "Merchant Operations",

        title: "Merchant Portal",

        description:
            "A centralized workspace that enables merchants to manage products, inventory, orders, customers, marketing campaigns and business performance from a unified dashboard.",

        icon: Building2,

        tags: [
            "Dashboard",
            "Orders",
            "Customers",
            "Inventory",
        ],

        status: "Coming Soon",
    },

    {
        category: "Marketplace",

        title: "Marketplace Engine",

        description:
            "Infrastructure for building multi-vendor marketplaces where merchants, suppliers and service providers can operate within a secure and scalable digital ecosystem.",

        icon: ShoppingBag,

        tags: [
            "Marketplace",
            "Multi-Vendor",
            "Digital Economy",
        ],

        status: "Coming Soon",
    },

    {
        category: "Payments",

        title: "Commerce Payments",

        description:
            "Integrated payment services supporting mobile money, cards, bank transfers, subscriptions, invoicing and secure transaction processing for businesses worldwide.",

        icon: CreditCard,

        tags: [
            "Paystack",
            "Flutterwave",
            "Subscriptions",
            "Billing",
        ],

        status: "Coming Soon",
    },

    {
        category: "Logistics",

        title: "Fulfillment Hub",

        description:
            "Warehouse management, shipping coordination and intelligent fulfillment services designed to streamline inventory movement and order delivery.",

        icon: Truck,

        tags: [
            "Warehouse",
            "Shipping",
            "Logistics",
            "Fulfillment",
        ],

        status: "Research",
    },

    {
        category: "Business Intelligence",

        title: "Commerce Intelligence",

        description:
            "AI-powered analytics providing merchants with sales forecasting, customer insights, inventory optimization and operational intelligence for data-driven decision making.",

        icon: BarChart3,

        tags: [
            "Analytics",
            "Artificial Intelligence",
            "Forecasting",
            "Business Intelligence",
        ],

        status: "Research",
    },
],

research: ([
    {
        year: "2026",

        title: "StoreForge Platform Architecture",

        description:
            "Research and engineering began on StoreForge as Evantra's flagship enterprise commerce platform, designed to support scalable multi-tenant digital businesses.",

        icon: Store,
    },

    {
        year: "2026",

        title: "Commerce Intelligence",

        description:
            "Exploration of AI-powered analytics, recommendation systems and predictive business intelligence to help merchants make better operational decisions.",

        icon: BarChart3,
    },

    {
        year: "2027",

        title: "Marketplace Infrastructure",

        description:
            "Development of scalable marketplace technologies supporting multiple merchants, digital services and cross-border commerce ecosystems.",

        icon: ShoppingBag,
    },

    {
        year: "Future",

        title: "Global Payment Infrastructure",

        description:
            "Research into international payment systems, multi-currency commerce and financial technologies enabling businesses to sell globally.",

        icon: CreditCard,
    },

    {
        year: "Future",

        title: "Supply Chain Intelligence",

        description:
            "Building intelligent logistics and warehouse optimization technologies using AI, automation and predictive inventory management.",

        icon: Warehouse,
    },

    {
        year: "Future",

        title: "Digital Commerce Ecosystems",

        description:
            "Long-term vision to create integrated commerce infrastructure connecting merchants, suppliers, logistics providers and customers across Africa and beyond.",

        icon: Globe2,
    },
]) as unknown as CompanyTimelineItem[],

culture: [
    {
        title: "Customer-Centered Innovation",

        description:
            "Every commerce solution we build begins with understanding merchants, businesses and customers. We focus on creating intuitive experiences that help organizations grow confidently in the digital economy.",

        icon: Building2,

        tags: [
            "Customer Success",
            "Innovation",
            "Experience",
        ],
    },

    {
        title: "Engineering Excellence",

        description:
            "We design scalable, secure and resilient commerce infrastructure capable of supporting businesses from startup to enterprise scale while maintaining exceptional reliability and performance.",

        icon: Store,

        tags: [
            "Scalability",
            "Reliability",
            "Performance",
        ],
    },

    {
        title: "Trust & Security",

        description:
            "Commerce depends on trust. Security, privacy, payment integrity and compliance are embedded into every platform we engineer to protect businesses and their customers.",

        icon: CreditCard,

        tags: [
            "Security",
            "Compliance",
            "Trust",
        ],
    },

    {
        title: "Continuous Innovation",

        description:
            "Digital commerce evolves rapidly. Our teams continuously research emerging technologies, artificial intelligence and automation to deliver next-generation commerce experiences.",

        icon: BarChart3,

        tags: [
            "Artificial Intelligence",
            "Research",
            "Growth",
        ],
    },

    {
        title: "Global Perspective",

        description:
            "We build commerce technologies with international expansion in mind, supporting localization, multiple currencies, regional payment methods and cross-border commerce.",

        icon: Globe2,

        tags: [
            "Global",
            "Localization",
            "Expansion",
        ],
    },

    {
        title: "Collaborative Ecosystems",

        description:
            "The future of commerce is connected. We foster collaboration between merchants, developers, logistics providers, financial institutions and technology partners to build thriving digital ecosystems.",

        icon: ShoppingBag,

        tags: [
            "Partnerships",
            "Ecosystem",
            "Collaboration",
        ],
    },
],

careers: {
    title: "Build the Future of Digital Commerce",

    description:
        "Join product engineers, designers, commerce specialists and innovators building the next generation of enterprise commerce technology. At the Evantra Commerce Center you'll help create secure, intelligent and scalable platforms that empower businesses across Africa and the global digital economy.",
},

slug: "commerce",

name: "Commerce Center",

 
};