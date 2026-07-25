import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "gpa-calculator",
  category: "calculator",

  title: "GPA Calculator",

  tagline: "Calculate your Grade Point Average instantly",

  description:
    "Free online GPA Calculator. Calculate your Grade Point Average using grades and credit hours. Fast, accurate, private, and works on any device.",

  keywords: [
    "gpa calculator",
    "grade point average calculator",
    "college gpa calculator",
    "university gpa calculator",
    "student gpa calculator",
    "semester gpa calculator",
    "gpa estimator",
    "calculate gpa"
  ],

  icon: "GraduationCap",

  tags: ["featured"],

  relatedTools: [
    "cgpa-calculator",
    "grade-calculator",
    "percentage-calculator"
  ],

  faqs: [
    {
      q: "How is GPA calculated?",
      a: "Multiply each course grade point by its credit hours, add the results together, then divide by total credit hours."
    },
    {
      q: "Can I calculate semester GPA?",
      a: "Yes. Add all courses for a semester and the calculator will compute your GPA."
    },
    {
      q: "Is this calculator free?",
      a: "Yes. It is completely free."
    },
    {
      q: "Is my data stored?",
      a: "No. Everything is calculated locally inside your browser."
    }
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [],

  outputFormats: [],

  maxFileSize: "",
};

export default meta;