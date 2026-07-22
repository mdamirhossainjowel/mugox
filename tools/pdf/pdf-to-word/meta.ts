import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "pdf-to-word",
  category: "pdf",
  title: "PDF to Word",
  tagline: "Convert a PDF into an editable Word document",
  description:
    "Convert PDF to Word (.docx) online for free — runs entirely in your browser, nothing is uploaded. Extracts headings, paragraphs, and lists into an editable document.",
  keywords: ["pdf to word", "pdf to docx", "convert pdf to word", "pdf to word converter online"],
  icon: "FileInput",
  tags: ["new"],
  relatedTools: ["word-to-pdf", "merge-pdf", "compress-pdf"],
  faqs: [
    { q: "Will the original layout be preserved exactly?", a: "Headings, paragraphs, and lists are reconstructed from the PDF's text, so the output is editable — but exact spacing, columns, and complex layouts from the original PDF won't be pixel-identical. This produces real, editable content, not a scanned image of the page." },
    { q: "Does this work on scanned PDFs?", a: "No — scanned or image-only PDFs contain no extractable text. This tool works on PDFs that were created digitally (from Word, Google Docs, a website, etc.)." },
    { q: "Is my document uploaded anywhere?", a: "No — extraction and conversion happen entirely in your browser." },
    { q: "What happens to images and tables in the PDF?", a: "This version focuses on text — headings, paragraphs, and lists. Images and complex tables are not extracted." },
  ],
  lastUpdated: "2026-07-21",
  maxFileSize: "20MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".docx"],
};

export default meta;