import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "compress-pdf",
  category: "pdf",
  title: "Compress PDF",
  tagline: "Reduce PDF file size without losing quality",
  description: "Free online PDF compressor. Reduce PDF file size by up to 90% — no uploads, runs entirely in your browser. Fast, private, and completely free.",
  keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf", "pdf file size reducer"],
  icon: "FileDown",
  tags: ["popular", "featured"],
  relatedTools: ["merge-pdf", "pdf-to-jpg", "compress-image"],
  faqs: [
    { q: "Is this PDF compressor free?", a: "Yes, completely free with no limits. No account required." },
    { q: "Do my files get uploaded to a server?", a: "Never. All compression happens in your browser using JavaScript. Your files never leave your device." },
    { q: "How much can I compress a PDF?", a: "Typically 30–80% reduction depending on content. Image-heavy PDFs compress more." },
    { q: "Will compression reduce quality?", a: "We use smart compression that targets file metadata and image streams while preserving readable quality." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;
