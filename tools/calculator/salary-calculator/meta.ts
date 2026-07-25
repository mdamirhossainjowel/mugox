import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "salary-calculator",
  category: "calculator",

  title: "Salary Calculator",

  tagline: "Calculate your salary after deductions",

  description:
    "Free online Salary Calculator. Estimate monthly, yearly, hourly, weekly, and daily salary. Quickly calculate gross salary and annual income. Fast, accurate, and private.",

  keywords: [
    "salary calculator",
    "salary estimator",
    "annual salary calculator",
    "monthly salary calculator",
    "hourly wage calculator",
    "weekly salary calculator",
    "gross salary calculator",
    "income calculator",
    "pay calculator"
  ],

  icon: "Wallet",

  tags: ["popular", "featured"],

  relatedTools: [
    "loan-emi-calculator",
    "mortgage-calculator",
    "gst-vat-calculator"
  ],

  faqs: [
    {
      q: "Can I calculate yearly salary?",
      a: "Yes. Enter your monthly salary to instantly calculate yearly earnings."
    },
    {
      q: "Does this calculator include taxes?",
      a: "No. This calculator estimates gross salary only."
    },
    {
      q: "Is this salary calculator free?",
      a: "Yes. It is completely free."
    },
    {
      q: "Is my salary information stored?",
      a: "No. Everything is calculated inside your browser."
    }
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [],

  outputFormats: [],

  maxFileSize: "",
};

export default meta;