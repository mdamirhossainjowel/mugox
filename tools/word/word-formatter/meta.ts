import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "word-formatter",
  category: "word",

  title: "Word Formatter",

  tagline:
    "Automatically format Word documents with professional fonts, headings, spacing, margins, and page layout.",

  description:
    "Format Microsoft Word documents online using professional formatting rules. Apply headings, fonts, margins, spacing, page numbers, citations and document styles directly in your browser without uploading your files.",

  keywords: [
    "word formatter",
    "docx formatter",
    "format word document",
    "apa formatter",
    "mla formatter",
    "ieee formatter",
    "harvard formatter",
    "word style formatter",
    "academic formatter",
    "research paper formatter",
    "thesis formatter",
    "word formatting tool",
  ],

  icon: "FileText",

  tags: ["new"],

  relatedTools: [
    "word-to-pdf",
    "pdf-to-word",
    "word-counter",
  ],

  faqs: [
    {
      q: "Does this tool change my original document?",
      a: "No. Your original DOCX file is never modified. A newly formatted copy is generated.",
    },
    {
      q: "Does this tool support academic document formatting?",
      a: "The tool currently provides customizable formatting options for fonts, headings, spacing, margins, and page layout. Additional academic formatting presets may be added in future updates.",
    },
    {
      q: "Are my files uploaded?",
      a: "No. Formatting happens entirely inside your browser. Your document never leaves your device.",
    },
    {
      q: "Can I customize fonts and spacing?",
      a: "Yes. You can choose font family, heading sizes, body text size, spacing, margins, alignment, headers, footers and page numbers.",
    },
  ],

  lastUpdated: "2026-07-24",

  maxFileSize: "25MB",

  acceptedFormats: [".docx"],

  outputFormats: [".docx"],
};

export default meta;