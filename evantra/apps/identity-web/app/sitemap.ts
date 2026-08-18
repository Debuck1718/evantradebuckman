import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const isWorkspace = process.env.EVANTRA_APP_SURFACE === "workspace";
  const baseUrl = isWorkspace
    ? "https://workspace.evantradebuckman.com"
    : "https://identity.evantradebuckman.com";
  const now = new Date();

  const publicRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/login", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/register", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/security", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/workers", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
