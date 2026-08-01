import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "qr-code-generator",
  category: "business",

  title: "Free QR Code Generator",

  tagline: "Generate beautiful QR codes instantly",

  description:
    "Create high-quality QR codes online for URLs, text, email, phone numbers, WiFi, SMS and more. Free, secure and processed locally in your browser.",

  keywords: [
    "qr code generator",
    "free qr code",
    "qr maker",
    "qr creator",
    "wifi qr",
    "url qr",
    "text qr",
    "mugox qr code"
  ],

  icon: "QrCode",

  tags: ["popular"],

  relatedTools: [
    "barcode-generator",
    "image-converter",
    "pdf-to-image"
  ],

  faqs: [
    {
      q: "Is this QR code generator free?",
      a: "Yes. You can generate unlimited QR codes for free."
    },
    {
      q: "Are my QR codes stored?",
      a: "No. Everything is generated locally in your browser."
    },
    {
      q: "Can I download the QR code?",
      a: "Yes. You can download it as PNG."
    },
    {
      q: "Can I create QR codes for WiFi or URLs?",
      a: "Yes. You can generate QR codes for URLs, text, WiFi, email, phone numbers and more."
    }
  ],

  lastUpdated: "2026-08-01",

  acceptedFormats: ["Text"],

  outputFormats: [".png"]
};

export default meta;