import type { MetadataRoute } from "next";
import { absoluteUrl, CONTENT_LAST_UPDATED, INDEXABLE_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Include canonical content pages. Draft policies and installer files have separate purposes.
  return INDEXABLE_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified: CONTENT_LAST_UPDATED }));
}
