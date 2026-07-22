import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "pdf-ocr",
  category: "pdf",
  title: "PDF OCR",
  tagline: "Extract text from scanned PDFs using OCR",
  description:
    "Free PDF OCR — extract text from scanned or image-based PDFs using on-device optical character recognition. Runs entirely in your browser, nothing is uploaded.",
  keywords: ["pdf ocr", "scanned pdf to text", "extract text from scanned pdf", "ocr pdf online", "image pdf to text"],
  icon: "ScanText",
  tags: ["new"],
  relatedTools: ["pdf-to-word", "split-pdf", "compress-pdf"],
  faqs: [
    { q: "How is this different from PDF to Word?", a: "PDF to Word extracts existing text layers. PDF OCR reads scanned pages (which are just images) using optical character recognition — for PDFs with no text layer at all." },
    { q: "How accurate is it?", a: "Accuracy depends on scan quality — clean, high-resolution, well-lit scans work best. Handwriting isn't supported." },
    { q: "Is my file uploaded anywhere?", a: "No — OCR runs on-device in your browser using a downloaded language model. Nothing is sent to a server." },
    { q: "How long does it take?", a: "The first run downloads a language model (a few MB), then each page takes a few seconds to process, depending on your device." },
  ],
  lastUpdated: "2026-07-05",
  maxFileSize: "30MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".txt", ".docx"],
};

export default meta;
