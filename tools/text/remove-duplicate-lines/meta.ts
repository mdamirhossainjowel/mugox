import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "remove-duplicate-lines",
  category: "text",
  title: "Remove Duplicate Lines",
  tagline: "Delete repeated lines from any list or text instantly",
  description: "Free online tool to remove duplicate lines from text. Paste a list, clean up repeated entries instantly, and copy or download the result. No signup required.",
  keywords: ["remove duplicate lines", "duplicate line remover", "remove duplicates from list", "unique lines online", "dedupe text tool"],
  icon: "ListX",
  tags: ["new"],
  relatedTools: ["text-sorter", "find-and-replace", "word-counter"],
  faqs: [
    { q: "How are duplicate lines detected?", a: "Each line is compared to every line seen before it. The first occurrence of a line is kept and any later repeats are removed." },
    { q: "Can I ignore capitalization when comparing lines?", a: "Yes — toggle off case sensitivity and \"Hello\" and \"hello\" will be treated as duplicates." },
    { q: "Does it ignore extra spaces at the start or end of a line?", a: "Enable \"Trim whitespace\" to treat lines that only differ by leading or trailing spaces as duplicates." },
    { q: "Is my text uploaded anywhere?", a: "No. Everything runs locally in your browser — your text never leaves your device." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;