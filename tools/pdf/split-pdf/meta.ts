import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "split-pdf",
  category: "pdf",
  title: "Split PDF",
  tagline: "Extract pages or split a PDF into separate files",
  description:
    "Split a PDF into individual pages or custom page ranges online — free, private, and instant. Runs entirely in your browser, nothing is uploaded.",
  keywords: ["split pdf", "extract pdf pages", "pdf splitter", "separate pdf pages", "pdf page extractor"],
  icon: "Scissors",
  tags: ["popular", "new"],
  relatedTools: ["merge-pdf", "delete-pdf-pages", "compress-pdf"],
  faqs: [
    { q: "Can I extract just a few pages?", a: "Yes — enter page numbers or ranges like \"1-3, 5, 8-10\" and each range becomes its own PDF." },
    { q: "What if I split into more than one file?", a: "You'll get a single .zip download containing every resulting PDF." },
    { q: "Is there a page limit?", a: "No hard limit — performance depends on your device since everything runs in your browser." },
  ],
  lastUpdated: "2026-07-04",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf", ".zip"],
};

export default meta;
