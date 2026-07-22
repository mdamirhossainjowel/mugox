import type { Metadata } from "next";
import { Shield, Zap, Lock, Globe } from "lucide-react";
import { TOOL_REGISTRY } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "About Mugox — Free Browser-Based Online Tools",
  description:
    "Mugox is a free online tools platform. Every tool runs in your browser — your files never leave your device. No accounts, no uploads, no cost.",
};

const values = [
  {
    icon: Shield,
    title: "Privacy by architecture",
    description:
      "Your files never leave your device. We don't have servers processing your data — there are no servers to process anything. All computation happens in your browser using JavaScript.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Every page is statically generated and served from a global CDN. Tool logic loads only when needed. We obsess over Core Web Vitals so every tool feels instant.",
  },
  {
    icon: Lock,
    title: "Free forever",
    description:
      "No freemium tricks. No file size limits hiding behind a paywall. No account required to unlock features. Every tool is free, every time.",
  },
  {
    icon: Globe,
    title: "Scaling to 5,000+ tools",
    description:
      "We're building the most comprehensive free online tools platform on the internet. New tools ship every week across dozens of categories.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--mg-ink)] mb-4">
          About Mugox
        </h1>
        <p className="text-[17px] text-[var(--mg-ink-3)] leading-relaxed max-w-xl mx-auto">
          We believe powerful tools should be free, private, and instant — not locked behind accounts and server uploads.
        </p>
      </div>

      <div className="prose-like space-y-6 text-[15px] text-[var(--mg-ink-2)] leading-relaxed mb-14">
        <p>
          Mugox is a free online tools platform with {TOOL_REGISTRY.length}+ tools and growing. Every tool runs
          entirely in your browser using modern JavaScript APIs — nothing is uploaded to our servers because
          we don&apos;t process your files at all.
        </p>
        <p>
          We started Mugox because existing tools either charged for basic features, required accounts for
          no reason, or uploaded sensitive files to third-party servers without being transparent about it.
          We set out to build something better: a platform that&apos;s genuinely free, genuinely private, and
          fast enough that the experience feels magical.
        </p>
        <p>
          Our revenue comes from non-intrusive advertising — never from your data, never from paywalls.
          That lets us keep every single tool free for everyone, forever.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {values.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-5 border border-[var(--mg-border)] rounded-2xl bg-[var(--mg-bg)]"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--mg-brand-bg)] flex items-center justify-center mb-3">
              <Icon className="text-[var(--mg-brand-t)]" style={{ width: 18, height: 18 }} />
            </div>
            <h2 className="text-[14px] font-semibold text-[var(--mg-ink)] mb-1">{title}</h2>
            <p className="text-[13px] text-[var(--mg-ink-3)] leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-[13px] text-[var(--mg-ink-4)]">
        Have feedback or a tool request?{" "}
        <a href="mailto:hello@mymugox.com" className="text-[var(--mg-brand)] hover:underline">
          hello@mymugox.com
        </a>
      </div>
    </div>
  );
}
