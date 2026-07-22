import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "word-counter",
  category: "text",
  title: "Word Counter",
  tagline: "Count words, characters, sentences, and paragraphs",
  description: "Free online word counter. Instantly count words, characters (with and without spaces), sentences, paragraphs, and reading time. No signup required.",
  keywords: ["word counter", "character counter", "count words online", "word count tool", "text counter"],
  icon: "AlignLeft",
  tags: ["popular", "featured"],
  relatedTools: ["character-counter", "case-converter", "json-formatter"],
  faqs: [
    { q: "Does this count words in real time?", a: "Yes — counts update instantly as you type or paste text." },
    { q: "What counts as a word?", a: "Any sequence of characters separated by whitespace. Numbers and hyphenated words count as one word." },
    { q: "Is there a character limit?", a: "No limit. Paste entire documents." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
