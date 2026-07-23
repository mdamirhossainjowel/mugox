// tools/image/remove-background/meta.ts
import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "background-removeimage",
  category: "image",
  title: "Remove Background",
  tagline: "Erase image backgrounds instantly with one click",
  description: "Remove the background from any photo online — automatic, AI-powered background removal that runs entirely in your browser. Free, private, no login.",
  keywords: ["remove background", "background remover", "transparent background", "erase background", "cutout image", "bg remover"],
  icon: "Scissors",
  tags: ["new", "popular"],
  relatedTools: ["resize-image", "compress-image", "convert-to-webp"],
  faqs: [
    { q: "How does background removal work?", a: "Mugox uses an on-device AI model that runs locally in your browser to detect the subject and erase everything else — no photo is ever uploaded to a server." },
    { q: "What image types are supported?", a: "JPG, PNG, and WebP images up to 15MB. The result always downloads as a transparent PNG." },
    { q: "Does it work on the first try?", a: "Yes, though the first run downloads a small on-device model, which is cached in your browser so future images process instantly." },
    { q: "Will the result have a transparent background?", a: "Yes — the output is a PNG with a transparent background so you can drop it onto any color, photo, or design." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "15MB",
  acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
  outputFormats: [".png"],
};

export default meta;