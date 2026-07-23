import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "protect-pdf",
  category: "pdf",
  title: "Protect PDF",
  tagline: "Add password protection to your PDF files",
  description:
    "Protect PDF documents with a secure password directly in your browser. Prevent unauthorized access without uploading your files.",
  keywords: [
    "protect pdf",
    "password protect pdf",
    "encrypt pdf",
    "secure pdf",
    "pdf password"
  ],
  icon: "Lock",
  tags: ["new"],
  relatedTools: ["unlock-pdf", "compress-pdf", "merge-pdf"],
  faqs: [
    {
      q: "Is my password stored anywhere?",
      a: "No. Password protection is applied entirely in your browser, and your password is never uploaded."
    },
    {
      q: "What encryption is used?",
      a: "The tool uses standard PDF encryption supported by modern PDF readers."
    },
    {
      q: "Can I remove the password later?",
      a: "Yes. Use the Unlock PDF tool with the correct password to remove protection."
    },
    {
      q: "Does password protection change the PDF quality?",
      a: "No. Only security settings are added; the document content remains unchanged."
    }
  ],
  lastUpdated: "2026-07-21",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;