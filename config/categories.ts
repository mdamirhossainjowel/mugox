import type { ToolCategory } from "@/types";

export const CATEGORIES: ToolCategory[] = [
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Compress, merge, split, convert, and edit PDF files — all free, all in your browser.",
    icon: "FileText",
    color: "#5b5ef4",
    bgColor: "#eeeeff",
    textColor: "#3730a3",
    darkBgColor: "#1e1b4b",
    darkTextColor: "#a5b4fc",
  },
  {
  slug: "word",
  name: "Word Tools",
  description:
    "Format, edit, convert, compare, and optimize Word documents — fast, free, and entirely in your browser.",
  icon: "FileType",
  color: "#2563eb",
  bgColor: "#eff6ff",
  textColor: "#1d4ed8",
  darkBgColor: "#172554",
  darkTextColor: "#93c5fd",
},
  {
    slug: "image",
    name: "Image Tools",
    description: "Resize, compress, convert, and edit images without losing quality.",
    icon: "Image",
    color: "#16a34a",
    bgColor: "#dcfce7",
    textColor: "#14532d",
    darkBgColor: "#052e16",
    darkTextColor: "#86efac",
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Count words, convert case, remove duplicates, and manipulate text instantly.",
    icon: "Type",
    color: "#d97706",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    darkBgColor: "#1c1400",
    darkTextColor: "#fcd34d",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format JSON, encode Base64, validate HTML, and more developer utilities.",
    icon: "Code",
    color: "#7c3aed",
    bgColor: "#f3e8ff",
    textColor: "#6b21a8",
    darkBgColor: "#1a0533",
    darkTextColor: "#d8b4fe",
  },
  {
    slug: "calculator",
    name: "Calculators",
    description: "BMI, percentage, age, loan, and hundreds of other calculators.",
    icon: "Calculator",
    color: "#dc2626",
    bgColor: "#fee2e2",
    textColor: "#7f1d1d",
    darkBgColor: "#1c0505",
    darkTextColor: "#fca5a5",
  },
];

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
