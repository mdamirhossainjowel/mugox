import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Mugox",
  description: "Mugox privacy policy. Your files never leave your browser. We explain exactly what data we collect and what we don't.",
};

const sections = [
  {
    title: "Your files never leave your device",
    content:
      "Every Mugox tool operates entirely within your browser using client-side JavaScript. When you upload a file to a Mugox tool, it is read by your browser and processed locally. No file content is transmitted to our servers at any point. This is not a policy promise — it is a technical fact enforced by the architecture of our platform.",
  },
  {
    title: "What we do collect",
    content:
      "We use Google Analytics to collect anonymous usage data: which pages are viewed, which tools are used, approximate geographic region (country level), device type, and browser. This data is aggregated and contains no personally identifiable information. We use this data to understand which tools are most useful and to improve the platform.",
  },
  {
    title: "Advertising",
    content:
      "We display advertisements via Google AdSense. Google may use cookies to show relevant ads based on your browsing history. You can opt out of personalized advertising at https://adssettings.google.com. We do not sell any personal data to advertisers.",
  },
  {
    title: "Cookies",
    content:
      "We store one cookie: your theme preference (light/dark/system mode) in localStorage. This is a functional preference, not a tracking cookie. Third-party services (Google Analytics, Google AdSense) may set their own cookies subject to their respective privacy policies.",
  },
  {
    title: "Children",
    content:
      "Mugox is not directed at children under 13. We do not knowingly collect personal information from children.",
  },
  {
    title: "Contact",
    content:
      "Questions about this policy? Email us at privacy@mymugox.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--mg-ink)] mb-2">Privacy Policy</h1>
      <p className="text-[13px] text-[var(--mg-ink-4)] mb-10">Last updated: January 1, 2025</p>
      <div className="space-y-8">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-[16px] font-semibold text-[var(--mg-ink)] mb-2">{title}</h2>
            <p className="text-[14px] text-[var(--mg-ink-3)] leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
