import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "base64-encoder",
  category: "developer",
  title: "Base64 Encoder / Decoder",
  tagline: "Encode and decode Base64 strings instantly",
  description: "Free online Base64 encoder and decoder. Encode text or files to Base64, or decode Base64 strings back to text — browser-based, private, instant.",
  keywords: ["base64 encoder", "base64 decoder", "encode base64", "decode base64", "base64 converter"],
  icon: "Binary",
  tags: ["popular"],
  relatedTools: ["json-formatter", "character-counter", "case-converter"],
  faqs: [
    { q: "What is Base64?", a: "Base64 is a way to encode binary data as ASCII text. It's commonly used in emails, data URLs, and APIs." },
    { q: "Can I encode files to Base64?", a: "Yes — upload any file to get its Base64 representation." },
    { q: "Is there a size limit?", a: "Up to 5MB for file encoding. Text encoding has no limit." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
