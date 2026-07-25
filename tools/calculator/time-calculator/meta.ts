import type { ToolMeta } from "@/types";

const meta: ToolMeta = {
  slug: "time-calculator",
  category: "calculator",

  title: "Time Calculator",

  tagline: "Calculate time difference, add or subtract hours and minutes",

  description:
    "Free online Time Calculator. Calculate time between two dates, add or subtract hours and minutes, and find total duration instantly.",

  keywords: [
    "time calculator",
    "hours calculator",
    "time difference",
    "time duration calculator",
    "add hours",
    "subtract hours",
    "minutes calculator",
    "date and time calculator",
  ],

  icon: "Clock3",

  tags: ["featured"],

  relatedTools: [
    "age-calculator",
    "date-calculator",
    "countdown-timer",
  ],

  faqs: [
    {
      q: "Can I calculate the difference between two times?",
      a: "Yes. Enter the start and end time to calculate the exact duration.",
    },
    {
      q: "Can I add hours and minutes?",
      a: "Yes. You can add or subtract any amount of time.",
    },
    {
      q: "Does it support 24-hour format?",
      a: "Yes. Both 12-hour and 24-hour formats are supported.",
    },
  ],

  lastUpdated: "2026-07-25",

  acceptedFormats: [],

  outputFormats: [],
};

export default meta;