import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "rotate-pdf",
  category: "pdf",
  title: "Rotate PDF",
  tagline: "Rotate PDF pages 90°, 180°, or 270° instantly",
  description:
    "Rotate all pages in a PDF online for free — fix sideways or upside-down scans in seconds. Runs entirely in your browser, nothing is uploaded.",
  keywords: ["rotate pdf", "turn pdf pages", "fix pdf orientation", "flip pdf", "pdf rotator"],
  icon: "RotateCw",
  tags: ["new"],
  relatedTools: ["split-pdf", "merge-pdf", "compress-pdf"],
  faqs: [
    { q: "Can I rotate just one page?", a: "This version rotates every page the same direction, which covers the most common case of scans coming in sideways." },
    { q: "Does rotating reduce quality?", a: "No — this only changes the page's rotation flag, so the PDF's original content and quality are untouched." },
  ],
  lastUpdated: "2026-07-04",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;
