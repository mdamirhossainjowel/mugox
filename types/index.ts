export interface ToolMeta {
  slug: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  keywords: string[];
  icon: string;
  tags: ToolTag[];
  relatedTools: string[];
  faqs: FAQ[];
  lastUpdated: string;
  maxFileSize?: string;
  acceptedFormats?: string[];
  outputFormats?: string[];
  browserSupport?: string[];
}

export type ToolTag = "popular" | "new" | "featured" | "pro-quality" | "hot";

export interface FAQ {
  q: string;
  a: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
  toolCount?: number;
}
