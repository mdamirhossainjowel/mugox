import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "merge-pdf",
  category: "pdf",
  title: "Merge PDF",
  tagline: "Combine multiple PDFs into one file",
  description: "Merge multiple PDF files into a single document online — free, instant, and private. Drag to reorder pages before combining.",
  keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger", "pdf combiner"],
  icon: "FilePlus",
  tags: ["popular"],
  relatedTools: ["compress-pdf", "pdf-to-jpg", "word-counter"],
  faqs: [
    { q: "How many PDFs can I merge at once?", a: "Up to 20 PDF files per merge. You can run the tool multiple times for more." },
    { q: "Can I reorder pages before merging?", a: "Yes — drag and drop the files to set the order before clicking Merge." },
    { q: "Is there a file size limit?", a: "Each file can be up to 50MB. Total combined size should be under 200MB." },
  ],
  lastUpdated: "2025-01-01",
  maxFileSize: "50MB each",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;
