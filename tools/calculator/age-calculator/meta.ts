import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "age-calculator",
  category: "calculator",
  title: "Age Calculator",
  tagline: "Calculate exact age in years, months, and days",
  description: "Calculate your exact age from your date of birth. Shows age in years, months, days, hours, minutes, and seconds. Free online age calculator.",
  keywords: ["age calculator", "calculate age", "how old am i", "date of birth calculator", "birthday calculator"],
  icon: "Calendar",
  tags: ["popular"],
  relatedTools: ["percentage-calculator", "bmi-calculator", "word-counter"],
  faqs: [
    { q: "How precise is the calculation?", a: "Very precise — down to seconds. It accounts for leap years and different month lengths." },
    { q: "Can I calculate the age on a specific date?", a: "Yes — set the 'Age at date' field to any date." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
