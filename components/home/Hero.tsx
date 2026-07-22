import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, Zap, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-start justify-center"
      >
        <div className="w-[600px] h-[300px] rounded-full opacity-[0.06] bg-[var(--mg-brand)] blur-[80px] -translate-y-1/3" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--mg-border)] bg-[var(--mg-bg-1)] text-[12px] text-[var(--mg-ink-3)] font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mg-success)] animate-pulse" />
          Free forever · No account required
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[var(--mg-ink)] mb-5">
          Free online tools.{" "}
          <span className="text-[var(--mg-brand)]">No login</span>{" "}
          needed.
        </h1>

        <p className="text-[16px] sm:text-[18px] text-[var(--mg-ink-3)] max-w-2xl mx-auto leading-relaxed mb-8">
          Compress PDFs, resize images, format JSON, and hundreds more tools — all running
          privately in your browser. Nothing is uploaded to servers.
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/tools">
            <Button variant="primary" size="lg" className="h-12 px-8 text-[15px]">
              Browse all tools
            </Button>
          </Link>
          <Link href="/pdf/compress-pdf">
            <Button variant="secondary" size="lg" className="h-12 px-8 text-[15px]">
              Compress a PDF
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
          {[
            { icon: Shield, text: "Files never leave your device" },
            { icon: Zap, text: "Instant — no waiting" },
            { icon: Lock, text: "No signup, ever" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[13px] text-[var(--mg-ink-4)]">
              <Icon className="w-3.5 h-3.5" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
