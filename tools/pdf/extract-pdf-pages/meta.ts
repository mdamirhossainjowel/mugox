import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "extract-pdf-pages",
  category: "pdf",

  title: "Extract PDF Pages",

  tagline: "Extract selected pages into a new PDF",

  description:
    "Extract specific pages from a PDF online for free. Select page numbers or ranges like 1,3,5-8 and download a brand new PDF instantly. Everything runs locally inside your browser.",

  keywords: [
    "extract pdf pages",
    "extract pages from pdf",
    "save selected pdf pages",
    "split selected pages",
    "pdf extractor",
  ],

  icon: "Scissors",

  tags: ["new"],

  relatedTools: [
    "split-pdf",
    "merge-pdf",
    "delete-pdf-pages",
  ],

  faqs: [
    {
      q: "Can I extract multiple pages?",
      a: "Yes. Enter page numbers or ranges like 1,3,5-8.",
    },
    {
      q: "Does it upload my PDF?",
      a: "No. Everything runs locally in your browser.",
    },
  ],

  lastUpdated: "2026-07-23",

  maxFileSize: "50MB",

  acceptedFormats: [".pdf"],

  outputFormats: [".pdf"],
};

export default meta;