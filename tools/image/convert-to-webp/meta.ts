import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "convert-to-webp",
  category: "image",
  title: "Convert to WebP",
  tagline: "Convert images to WebP for faster websites",
  description: "Convert JPG, PNG, and GIF images to WebP format online. WebP is 25–35% smaller than JPEG with the same quality. Free and browser-based.",
  keywords: ["convert to webp", "jpg to webp", "png to webp", "webp converter", "image to webp"],
  icon: "Zap",
  tags: ["new"],
  relatedTools: ["compress-image", "resize-image", "pdf-to-jpg"],
  faqs: [
    { q: "Why use WebP instead of JPG?", a: "WebP files are typically 25–35% smaller than equivalent JPEGs, which speeds up website load times." },
    { q: "Do all browsers support WebP?", a: "Yes — all modern browsers (Chrome, Firefox, Safari 14+, Edge) support WebP." },
    { q: "Can I convert multiple files?", a: "Yes — select multiple images to convert them all at once." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "20MB",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  outputFormats: [".webp"],
};

export default meta;
