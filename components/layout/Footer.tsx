import Link from "next/link";
import { Shield } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { TOOL_REGISTRY } from "@/lib/tools/registry";
import { Logo } from "./Logo";

const popularTools = [
  { slug: "compress-pdf", category: "pdf", title: "Compress PDF" },
  { slug: "resize-image", category: "image", title: "Resize Image" },
  { slug: "word-counter", category: "text", title: "Word Counter" },
  { slug: "json-formatter", category: "developer", title: "JSON Formatter" },
  { slug: "percentage-calculator", category: "calculator", title: "Percentage Calculator" },
  { slug: "bmi-calculator", category: "calculator", title: "BMI Calculator" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--mg-border)] bg-[var(--mg-bg-1)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <Logo size={26} />
            </div>
            <p className="text-[12px] text-[var(--mg-ink-4)] leading-relaxed max-w-[200px]">
              {TOOL_REGISTRY.length}+ free online tools. No login, no uploads to servers — everything runs in your browser.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--mg-success-bg)] text-[var(--mg-success-t)]">
                <Shield className="w-3 h-3" /> Privacy first
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--mg-bg-2)] text-[var(--mg-ink-3)]">
                Free forever
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--mg-ink-4)] mb-3">Categories</p>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-[12px] text-[var(--mg-ink-3)] hover:text-[var(--mg-ink)] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-[12px] text-[var(--mg-brand)] hover:text-[var(--mg-brand-h)] transition-colors font-medium">
                  All tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--mg-ink-4)] mb-3">Popular</p>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.category}/${tool.slug}`} className="text-[12px] text-[var(--mg-ink-3)] hover:text-[var(--mg-ink)] transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--mg-ink-4)] mb-3">Company</p>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy policy" },
                { href: "/terms", label: "Terms of service" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12px] text-[var(--mg-ink-3)] hover:text-[var(--mg-ink)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--mg-border)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[var(--mg-ink-4)]">
            © {new Date().getFullYear()} Mugox. All rights reserved.
          </p>
          <p className="text-[11px] text-[var(--mg-ink-4)]">
            Built with ❤ — your files never leave your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
