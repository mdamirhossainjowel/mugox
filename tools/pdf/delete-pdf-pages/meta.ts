import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "delete-pdf-pages",
  category: "pdf",
  title: "Delete PDF Pages",
  tagline: "Remove specific pages from a PDF",
  description:
    "Delete unwanted pages from a PDF online for free — enter page numbers or ranges to remove, runs entirely in your browser with nothing uploaded.",
  keywords: ["delete pdf pages", "remove pdf pages", "pdf page remover", "delete page from pdf"],
  icon: "FileX",
  tags: ["new"],
  relatedTools: ["split-pdf", "merge-pdf", "rotate-pdf"],
  faqs: [
    { q: "How do I choose which pages to remove?", a: "Enter page numbers or ranges like \"2, 4, 6-8\" and those pages are removed from the output." },
    { q: "Can I remove every page?", a: "No — at least one page must remain in the output PDF." },
  ],
  lastUpdated: "2026-07-04",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;
