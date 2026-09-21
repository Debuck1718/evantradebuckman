export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  keywords: string[];
  group: string;
}

export const searchIndex: SearchEntry[] = [
  {
    title: "Home",
    description: "Evantra global headquarters — software, cybersecurity and systems engineering.",
    href: "/",
    keywords: ["home", "evantra", "enterprise", "overview"],
    group: "Company",
  },
  {
    title: "About Evantra",
    description: "Who we are, our mission and how we operate as a global technology enterprise.",
    href: "/about",
    keywords: ["about", "mission", "story", "company profile"],
    group: "Company",
  },
  {
    title: "Company",
    description: "The Evantra corporate structure, leadership and operating divisions.",
    href: "/company",
    keywords: ["company", "leadership", "divisions", "corporate"],
    group: "Company",
  },
  {
    title: "Vision",
    description: "Where Evantra is going — long-term direction and future platforms.",
    href: "/vision",
    keywords: ["vision", "future", "roadmap", "strategy"],
    group: "Company",
  },
  {
    title: "Evantra Identity",
    description: "Unified identity, SSO and access infrastructure for the Evantra ecosystem.",
    href: "/identity",
    keywords: ["identity", "sso", "login", "authentication", "account", "access", "workspace"],
    group: "Products",
  },
  {
    title: "Software & Platforms",
    description: "Evantra software engineering: enterprise platforms, cloud and applied AI.",
    href: "/companies/software",
    keywords: ["software", "platform", "cloud", "engineering", "storeforge", "saas"],
    group: "Divisions",
  },
  {
    title: "Cybersecurity",
    description: "Sovereign cybersecurity, zero-knowledge architecture and digital resilience.",
    href: "/companies/cybersecurity",
    keywords: ["cybersecurity", "security", "zero trust", "encryption", "defense"],
    group: "Divisions",
  },
  {
    title: "Artificial Intelligence",
    description: "Applied AI, cognitive systems and responsible machine intelligence at Evantra.",
    href: "/companies/artificial-intelligence",
    keywords: ["ai", "artificial intelligence", "machine learning", "cognitive", "models"],
    group: "Divisions",
  },
  {
    title: "Engineering",
    description: "Mission-critical systems engineering, infrastructure and architecture.",
    href: "/companies/engineering",
    keywords: ["engineering", "systems", "infrastructure", "architecture"],
    group: "Divisions",
  },
  {
    title: "Global Commerce",
    description: "Digital commerce, trading platforms and global market operations.",
    href: "/companies/commerce",
    keywords: ["commerce", "trade", "market", "import", "export", "fintech"],
    group: "Divisions",
  },
  {
    title: "Innovation",
    description: "Evantra innovation lab — research, incubation and emerging technology.",
    href: "/companies/innovation",
    keywords: ["innovation", "lab", "incubation", "emerging technology", "startup"],
    group: "Divisions",
  },
  {
    title: "Research",
    description: "Research and innovation across the Evantra technology divisions.",
    href: "/research",
    keywords: ["research", "publications", "science", "r&d"],
    group: "Resources",
  },
  {
    title: "Resources",
    description: "Guides, insights and reference material from the Evantra ecosystem.",
    href: "/resources",
    keywords: ["resources", "guides", "insights", "blog", "docs"],
    group: "Resources",
  },
  {
    title: "Contact",
    description: "Talk to Evantra — partnerships, projects and general inquiries.",
    href: "/contact",
    keywords: ["contact", "email", "support", "partnership", "inquiry", "sales"],
    group: "Resources",
  },
  {
    title: "Privacy Policy",
    description: "How Evantra collects, uses and protects information.",
    href: "/privacy",
    keywords: ["privacy", "data", "policy", "gdpr", "compliance"],
    group: "Legal",
  },
  {
    title: "Terms of Service",
    description: "The terms governing use of Evantra products and services.",
    href: "/terms",
    keywords: ["terms", "legal", "agreement", "conditions"],
    group: "Legal",
  },
];

export function searchSite(query: string): SearchEntry[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return searchIndex.slice(0, 6);
  }

  const terms = normalized.split(/\s+/);

  return searchIndex
    .map((entry) => {
      const haystack =
        `${entry.title} ${entry.description} ${entry.keywords.join(" ")}`.toLowerCase();

      const score = terms.reduce(
        (total, term) =>
          entry.title.toLowerCase().includes(term)
            ? total + 3
            : haystack.includes(term)
              ? total + 1
              : total,
        0,
      );

      return { entry, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((result) => result.entry);
}
