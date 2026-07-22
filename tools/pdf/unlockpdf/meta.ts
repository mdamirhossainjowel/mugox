import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "unlock-pdf",
  category: "pdf",
  title: "Unlock PDF",
  tagline: "Remove password protection from PDF files",
  description:
    "Unlock password-protected PDF files online for free. Remove restrictions and access your PDF directly in your browser without uploading your files.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "pdf password remover",
    "unlock protected pdf",
    "remove pdf restrictions"
  ],
  icon: "Unlock",
  tags: ["new"],
  relatedTools: ["protect-pdf", "compress-pdf", "merge-pdf"],
  faqs: [
    {
      q: "Is my PDF uploaded to a server?",
      a: "No. Everything happens locally in your browser, ensuring your documents remain private."
    },
    {
      q: "Can I unlock a PDF without the password?",
      a: "No. You must know the correct password to remove password protection."
    },
    {
      q: "Will the original formatting change?",
      a: "No. The PDF content and formatting remain exactly the same after unlocking."
    },
    {
      q: "Can I unlock multiple PDFs?",
      a: "Yes, if supported by the tool. Each file is processed securely in your browser."
    }
  ],
  lastUpdated: "2026-07-21",
  maxFileSize: "50MB",
  acceptedFormats: [".pdf"],
  outputFormats: [".pdf"],
};

export default meta;