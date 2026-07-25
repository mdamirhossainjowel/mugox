import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "gst-vat-calculator",
  category: "calculator",

  title: "GST / VAT Calculator",

  tagline: "Calculate GST or VAT instantly",

  description:
    "Free online GST & VAT Calculator. Add or remove GST/VAT from any amount instantly. Fast, accurate, private, and works entirely in your browser.",

  keywords: [
    "gst calculator",
    "vat calculator",
    "tax calculator",
    "remove vat",
    "add vat",
    "gst percentage calculator",
    "online gst calculator",
    "online vat calculator",
    "sales tax calculator"
  ],

  icon: "Receipt",

  tags: ["popular", "featured"],

  relatedTools: [
    "discount-calculator",
    "salary-calculator",
    "loan-emi-calculator"
  ],

  faqs: [
    {
      q: "Can I add GST or VAT?",
      a: "Yes. You can either add GST/VAT to a base amount or remove GST/VAT from a tax-inclusive amount."
    },
    {
      q: "Is this calculator free?",
      a: "Yes. It is completely free and works without registration."
    },
    {
      q: "Does this support all GST/VAT rates?",
      a: "Yes. Simply enter your country's GST or VAT percentage."
    },
    {
      q: "Is my financial data uploaded?",
      a: "No. Everything is calculated locally inside your browser."
    }
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [],

  outputFormats: [],

  maxFileSize: "",
};

export default meta;