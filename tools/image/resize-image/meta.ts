import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "resize-image",
  category: "image",
  title: "Resize Image",
  tagline: "Change image dimensions while preserving quality",
  description: "Resize images online for free — set exact pixel dimensions or scale by percentage. Supports JPG, PNG, WebP, and GIF. No signup, browser-only.",
  keywords: ["resize image", "image resizer", "change image size", "scale image", "resize photo online"],
  icon: "Maximize",
  tags: ["popular", "featured"],
  relatedTools: ["compress-image", "convert-to-webp", "pdf-to-jpg"],
  faqs: [
    { q: "Will resizing reduce image quality?", a: "We use high-quality Lanczos resampling to minimize quality loss when downsizing." },
    { q: "Can I maintain the aspect ratio?", a: "Yes — the 'Lock aspect ratio' option is on by default." },
    { q: "What formats are supported?", a: "JPG, PNG, WebP, GIF, BMP, and TIFF." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "20MB",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"],
  outputFormats: [".jpg", ".png", ".webp"],
};

export default meta;
