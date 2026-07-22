import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "json-formatter",
  category: "developer",
  title: "JSON Formatter",
  tagline: "Prettify, validate, and minify JSON instantly",
  description: "Format and validate JSON online. Prettify minified JSON, minify formatted JSON, and catch syntax errors — free, browser-based, instant.",
  keywords: ["json formatter", "json beautifier", "json validator", "format json", "json prettifier", "minify json"],
  icon: "Braces",
  tags: ["popular", "featured"],
  relatedTools: ["base64-encoder", "character-counter", "word-counter"],
  faqs: [
    { q: "Does this validate JSON?", a: "Yes — invalid JSON will show an error with the line and character position of the problem." },
    { q: "Can I minify JSON?", a: "Yes — the Minify button removes all whitespace to make JSON as compact as possible." },
    { q: "Is my data sent anywhere?", a: "Never. JSON formatting happens entirely in your browser." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
