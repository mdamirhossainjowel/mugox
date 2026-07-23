import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "pdf-page-numbers",
  category: "pdf",

  title: "Add Page Numbers to PDF",

  tagline:
    "Insert page numbers into PDF files online",

  description:
    "Free online PDF Page Number tool. Add page numbers to every page of your PDF with customizable position, font size, margins, starting number, and color. Everything is processed securely inside your browser.",

  keywords: [
    "pdf page numbers",
    "add page numbers to pdf",
    "insert page numbers pdf",
    "number pdf pages",
    "page numbering tool",
    "pdf numbering online",
    "pdf editor",
    "free pdf page numbers"
  ],

  icon: "Hash",

  tags: ["new"],

  relatedTools: [
    "extract-pdf-pages",
    "reorder-pdf-pages",
    "delete-pdf-pages"
  ],

  faqs: [
    {
      q: "Can I start numbering from any page number?",
      a: "Yes. You can choose any starting page number such as 1, 5, 100, or any custom value."
    },
    {
      q: "Can I place numbers at the bottom or top?",
      a: "Yes. Choose from six positions: Top Left, Top Center, Top Right, Bottom Left, Bottom Center, and Bottom Right."
    },
    {
      q: "Will my PDF quality change?",
      a: "No. Only page numbers are added. Your original page quality remains unchanged."
    },
    {
      q: "Are my files uploaded?",
      a: "No. Everything runs locally inside your browser. Your files never leave your device."
    }
  ],

  lastUpdated: "2026-07-23",

  maxFileSize: "50MB",

  acceptedFormats: [".pdf"],

  outputFormats: [".pdf"],
};

export default meta;