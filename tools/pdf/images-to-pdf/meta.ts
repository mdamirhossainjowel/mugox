import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "images-to-pdf",
  category: "pdf",
  title: "Images to PDF",
  tagline: "Combine JPG or PNG images into one PDF",
  description:
    "Convert JPG or PNG images into a single PDF online for free — reorder pages before combining, runs entirely in your browser with nothing uploaded.",
  keywords: ["jpg to pdf", "png to pdf", "images to pdf", "image to pdf converter", "photo to pdf"],
  icon: "FileImage",
  tags: ["popular", "new"],
  relatedTools: ["pdf-to-jpg", "merge-pdf", "compress-image"],
  faqs: [
    { q: "What image formats are supported?", a: "JPG and PNG. Each image becomes its own page, in the order you arrange them." },
    { q: "Can I reorder images before converting?", a: "Yes — drag and drop to set the page order before clicking Create PDF." },
    { q: "Will the PDF page match my image's size?", a: "Yes, each page is sized to match its image so nothing gets cropped or stretched." },
  ],
  lastUpdated: "2026-07-04",
  maxFileSize: "20MB each",
  acceptedFormats: [".jpg", ".jpeg", ".png"],
  outputFormats: [".pdf"],
};

export default meta;
