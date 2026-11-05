import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Search and user-directed retrieval are distinct from model training.
    // The wildcard preserves the site's existing unrestricted public policy.
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"], allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
