import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "compress-image",
  category: "image",
  title: "Compress Image",
  tagline: "Reduce image file size without visible quality loss",
  description: "Compress JPG, PNG, and WebP images online — reduce file size by up to 90% while keeping images looking great. Free, browser-based, private.",
  keywords: ["compress image", "image compressor", "reduce image size", "shrink image", "optimize image"],
  icon: "ImageDown",
  tags: ["popular"],
  relatedTools: ["resize-image", "convert-to-webp", "compress-pdf"],
  faqs: [
    { q: "How much can images be compressed?", a: "Typically 40–90% reduction. PNG files often compress more than JPGs." },
    { q: "Will I see quality loss?", a: "At the default quality setting (80%), compression is visually lossless for most images." },
    { q: "Can I compress multiple images at once?", a: "Yes — select multiple files to batch compress them all." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "20MB",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
  outputFormats: [".jpg", ".png", ".webp"],
};

export default meta;
