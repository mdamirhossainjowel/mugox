import type { Metadata } from "next";
import type { ToolMeta } from "@/types";
import { siteConfig } from "@/config/site";

export function generateToolMetadata(tool: ToolMeta): Metadata {
  const title = `${tool.title} — Free Online | Mugox`;
  const url = `${siteConfig.url}/${tool.category}/${tool.slug}`;

  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} — Free, Fast & Private`,
      description: tool.tagline,
      url,
      siteName: "Mugox",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} — Free Online Tool`,
      description: tool.tagline,
    },
  };
}

export function generateCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  description: string
): Metadata {
  return {
    title: `Free ${categoryName} Online | Mugox`,
    description,
    alternates: { canonical: `${siteConfig.url}/${categorySlug}` },
    openGraph: {
      title: `Free ${categoryName} — No Login Required`,
      description,
      url: `${siteConfig.url}/${categorySlug}`,
      siteName: "Mugox",
    },
  };
}
