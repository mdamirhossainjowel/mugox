import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "word-to-pdf",
  category: "pdf",
  title: "Word to PDF",
  tagline: "Convert a Word document into a PDF",
  description:
    "Convert Word (.docx) to PDF online for free — runs entirely in your browser, nothing is uploaded. Best for text, headings, and basic formatting.",
  keywords: ["word to pdf", "docx to pdf", "convert word to pdf", "doc to pdf converter"],
  icon: "FileOutput",
  tags: ["new"],
  relatedTools: ["pdf-to-word", "merge-pdf", "compress-pdf"],
  faqs: [
    { q: "Will complex formatting be preserved?", a: "Basic formatting (headings, bold, italic, lists, paragraphs) converts well. Complex layouts, tables, and precise page design may shift — this renders the document's content, not a pixel-perfect copy of Word's layout engine." },
    { q: "Is the output text selectable?", a: "The page is rendered as an image inside the PDF, so text isn't selectable in the output. It's best for sharing or printing, not further editing." },
    { q: "Is my document uploaded anywhere?", a: "No — conversion happens entirely in your browser." },
  ],
  lastUpdated: "2026-07-05",
  maxFileSize: "20MB",
  acceptedFormats: [".docx"],
  outputFormats: [".pdf"],
};

export default meta;
