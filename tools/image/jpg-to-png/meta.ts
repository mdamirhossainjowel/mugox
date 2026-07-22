import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "jpg-to-png",
  category: "image",

  title: "JPG to PNG",
  tagline: "Convert JPG images to high-quality PNG files",

  description:
    "Convert JPG or JPEG images to PNG instantly in your browser. No uploads, no quality loss, and your files stay private on your device.",

  keywords: [
    "jpg to png",
    "jpeg to png",
    "convert jpg to png",
    "image converter",
    "jpg converter",
    "png converter",
    "online image converter",
    "free jpg to png",
    "browser image converter",
    "mugox image tools",
  ],

  icon: "Image",

  tags: ["popular"],

  relatedTools: [
    "png-to-jpg",
    "webp-to-png",
    "jpg-to-webp",
    "resize-image",
    "compress-image",
    "crop-image",
  ],

  faqs: [
    {
      q: "Is JPG to PNG conversion free?",
      a: "Yes. You can convert JPG images to PNG completely free using this tool.",
    },
    {
      q: "Are my images uploaded to a server?",
      a: "No. Everything happens locally in your browser, so your images never leave your device.",
    },
    {
      q: "Will the PNG lose quality?",
      a: "No. The PNG is generated directly from the original JPG image without additional quality loss.",
    },
    {
      q: "Can I convert multiple JPG files?",
      a: "The current version supports one image at a time. Batch conversion will be available in a future update.",
    },
  ],

  lastUpdated: "2026-07-22",

  maxFileSize: "20MB",

  acceptedFormats: [
    ".jpg",
    ".jpeg",
  ],

  outputFormats: [
    ".png",
  ],
};

export default meta;