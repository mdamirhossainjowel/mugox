import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "pdf-to-jpg",
  category: "pdf",
  title: "PDF to JPG",
  tagline: "Convert PDF pages to high-quality JPG images",
  description: "Convert PDF pages to JPG images online for free. Choose quality, extract single pages or all pages — private, fast, no signup.",
  keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpeg", "pdf page to image", "extract images from pdf"],
  icon: "FileImage",
  tags: ["popular", "new"],
  relatedTools: ["compress-pdf", "compress-image", "resize-image"],
  faqs: [
    { q: "What quality are the output images?", a: "You can choose from 72 DPI (web) to 300 DPI (print quality)." },
    { q: "Can I convert just one page?", a: "Yes — choose 'All pages' or enter a specific page number." },
    { q: "What image formats are supported?", a: "JPG and PNG output. JPG is smaller, PNG is lossless." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".jpg", ".png"],
};

export default meta;
