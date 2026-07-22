import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "case-converter",
  category: "text",
  title: "Case Converter",
  tagline: "Convert text to uppercase, lowercase, title case, and more",
  description: "Convert text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case — free and instant.",
  keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "text case changer", "camelcase converter"],
  icon: "CaseSensitive",
  tags: ["popular"],
  relatedTools: ["word-counter", "character-counter", "json-formatter"],
  faqs: [
    { q: "What cases are supported?", a: "UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case." },
    { q: "Can I convert multiple paragraphs?", a: "Yes — paste any amount of text and choose a case." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
