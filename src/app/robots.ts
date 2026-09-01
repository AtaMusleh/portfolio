import type { MetadataRoute } from "next";

const SITE_URL = "https://portfolio-virid-seven-f13k2sqmwj.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The styleguide is a working reference, not content.
      disallow: "/styleguide",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
