import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "invoice-generator",

  category: "business",

  title: "Invoice Generator",

  tagline:
    "Create professional invoices online for free",

  description:
    "Generate professional invoices online with your company logo, client information, products, taxes, discounts and totals. Download as PDF instantly. Free, private and works entirely in your browser.",

  keywords: [
    "invoice generator",
    "free invoice maker",
    "online invoice",
    "business invoice",
    "invoice template",
    "invoice pdf",
    "professional invoice",
    "gst invoice",
    "vat invoice",
    "quotation",
    "receipt",
  ],

  icon: "Receipt",

  tags: [
    "featured",
    "popular",
  ],

  relatedTools: [
    "mortgage-calculator",
    "salary-calculator",
    "gst-vat-calculator",
  ],

  faqs: [
    {
      q: "Is this invoice generator free?",
      a: "Yes. It is completely free and runs inside your browser.",
    },
    {
      q: "Do you store my invoices?",
      a: "No. Everything stays on your device. Nothing is uploaded to our servers.",
    },
    {
      q: "Can I add my company logo?",
      a: "Yes. Upload your logo and it will appear on the invoice.",
    },
    {
      q: "Can I download the invoice as PDF?",
      a: "Yes. You can print or download the invoice as PDF.",
    },
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
  ],

  outputFormats: [
    ".pdf",
  ],
};

export default meta;