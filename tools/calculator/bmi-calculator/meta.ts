import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "bmi-calculator",
  category: "calculator",
  title: "BMI Calculator",
  tagline: "Calculate your Body Mass Index instantly",
  description: "Free online BMI calculator. Enter your height and weight to calculate your Body Mass Index and see which BMI category you fall into.",
  keywords: ["bmi calculator", "body mass index", "calculate bmi", "bmi chart", "bmi formula"],
  icon: "Activity",
  tags: ["popular"],
  relatedTools: ["age-calculator", "percentage-calculator", "word-counter"],
  faqs: [
    { q: "What is BMI?", a: "Body Mass Index (BMI) is a measure calculated from height and weight. It's used as a screening tool for weight categories." },
    { q: "What are the BMI categories?", a: "Underweight: <18.5, Normal: 18.5–24.9, Overweight: 25–29.9, Obese: ≥30." },
    { q: "Are metric and imperial units supported?", a: "Yes — switch between kg/cm and lbs/inches." },
  ],
  lastUpdated: "2025-01-01",
};

export default meta;
