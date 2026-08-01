import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "barcode-generator",

  category: "business",

  title: "Free Barcode Generator",

  tagline: "Generate high-quality barcodes instantly",

  description:
    "Create professional barcodes online for free. Generate Code 128, Code 39, EAN-13, UPC, ITF, Codabar and more directly in your browser. No upload required.",

  keywords: [
    "barcode generator",
    "free barcode generator",
    "online barcode maker",
    "code 128 generator",
    "ean13 generator",
    "upc barcode generator",
    "barcode creator",
    "barcode online",
    "barcode image",
    "mugox barcode"
  ],

  icon: "Barcode",

  tags: ["new"],

  relatedTools: [
    "invoice-generator",
    "mortgage-calculator",
    "word-formatter",
  ],

  faqs: [
    {
      q: "Is this barcode generator free?",
      a: "Yes. You can generate unlimited barcodes completely free."
    },
    {
      q: "Are my barcodes uploaded?",
      a: "No. Everything is generated locally in your browser."
    },
    {
      q: "Can I download the barcode?",
      a: "Yes. You can download the generated barcode as PNG or SVG."
    },
    {
      q: "Which barcode formats are supported?",
      a: "Supports Code 128, Code 39, EAN-13, UPC-A, ITF, Codabar and more."
    }
  ],

  lastUpdated: "2026-08-01",

  acceptedFormats: ["Text"],

  outputFormats: [
    ".png",
    ".svg"
  ]
};

export default meta;