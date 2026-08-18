import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://evantradebuckman.com";
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/company", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/vision", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/identity", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/research", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/resources", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/companies/artificial-intelligence", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/companies/software", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/companies/cybersecurity", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/companies/commerce", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/companies/engineering", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/companies/innovation", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
