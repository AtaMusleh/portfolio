import type { MetadataRoute } from "next";

import { projects } from "@/content";

const SITE_URL = "https://portfolio-virid-seven-f13k2sqmwj.vercel.app";

/**
 * Built from the projects array, so adding a project cannot leave the sitemap
 * stale. /styleguide is deliberately absent — it is a private reference page
 * and is also noindex'd at the route.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
