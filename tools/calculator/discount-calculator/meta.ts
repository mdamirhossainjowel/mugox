import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "discount-calculator",
  category: "calculator",

  title: "Discount Calculator",

  tagline: "Calculate discounts, sale price, and savings instantly",

  description:
    "Free online Discount Calculator. Calculate sale price, percentage discount, money saved, and original price instantly. Runs entirely in your browser with no registration required.",

  keywords: [
    "discount calculator",
    "sale calculator",
    "price discount calculator",
    "percentage discount",
    "discount percentage calculator",
    "calculate discount",
    "sale price calculator",
    "discount tool",
    "online discount calculator",
  ],

  icon: "BadgePercent",

  tags: ["popular", "featured"],

  relatedTools: [
    "gst-vat-calculator",
    "loan-emi-calculator",
    "salary-calculator",
  ],

  faqs: [
    {
      q: "How do I calculate a discount?",
      a: "Enter the original price and the discount percentage. The calculator instantly shows the final price and total savings.",
    },
    {
      q: "Is this Discount Calculator free?",
      a: "Yes. It is completely free with no registration or usage limits.",
    },
    {
      q: "Does my data leave my device?",
      a: "No. All calculations happen directly in your browser. Nothing is uploaded.",
    },
    {
      q: "Can I calculate fixed amount discounts?",
      a: "This calculator is designed for percentage-based discounts. Fixed discounts may be added in a future update.",
    },
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [],

  outputFormats: [],

  maxFileSize: "",
};

export default meta;