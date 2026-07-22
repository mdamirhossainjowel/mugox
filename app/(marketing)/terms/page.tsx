import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Mugox",
  description: "Mugox terms of service.",
};

const sections = [
  {
    title: "Acceptance of terms",
    content:
      "By using Mugox, you agree to these terms. If you do not agree, do not use the platform.",
  },
  {
    title: "Use of the platform",
    content:
      "Mugox provides free browser-based tools for personal and commercial use. You may not use Mugox to process files you do not have the right to process, to reverse-engineer our platform, or for any unlawful purpose.",
  },
  {
    title: "No warranties",
    content:
      "Mugox is provided 'as is' without warranty of any kind. We do not guarantee that tools will be error-free or suitable for any particular purpose. Use at your own risk.",
  },
  {
    title: "Limitation of liability",
    content:
      "To the maximum extent permitted by law, Mugox is not liable for any loss of data, loss of profits, or any indirect or consequential loss arising from use of the platform.",
  },
  {
    title: "Intellectual property",
    content:
      "The Mugox name, logo, and platform code are our intellectual property. Tools are provided for your use but may not be scraped or redistributed.",
  },
  {
    title: "Changes",
    content:
      "We may update these terms at any time. Continued use of Mugox after changes constitutes acceptance of the updated terms.",
  },
  {
    title: "Contact",
    content: "Questions? Email legal@mymugox.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--mg-ink)] mb-2">Terms of Service</h1>
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
