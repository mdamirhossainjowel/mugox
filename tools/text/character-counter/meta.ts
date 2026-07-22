import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "character-counter",
  category: "text",
  title: "Character Counter",
  tagline: "Count characters with and without spaces",
  description: "Count characters instantly with this free online tool. Shows total characters, characters without spaces, words, lines, and more.",
  keywords: ["character counter", "count characters", "character count", "text length counter", "string length"],
  icon: "Hash",
  tags: ["popular"],
  relatedTools: ["word-counter", "case-converter", "base64-encoder"],
  faqs: [
    { q: "Does it count spaces?", a: "Yes — it shows both total characters (with spaces) and characters without spaces separately." },
    { q: "Is there a limit on text length?", a: "No — paste as much text as you need." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
