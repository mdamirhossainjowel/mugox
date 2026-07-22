import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CircleCheck, Shield, Zap, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Dual-tone glow echoing the brand gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <div className="w-[520px] h-[280px] rounded-full opacity-[0.10] bg-gradient-to-r from-violet-500 to-blue-500 blur-[90px] -translate-y-1/3 -translate-x-24" />
        <div className="w-[420px] h-[260px] rounded-full opacity-[0.08] bg-gradient-to-r from-indigo-500 to-cyan-400 blur-[90px] -translate-y-1/4 translate-x-32" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--mg-border)] bg-[var(--mg-bg-1)] text-[12px] text-[var(--mg-ink-3)] font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mg-success)] animate-pulse" />
          Free forever · No account required
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[var(--mg-ink)] mb-5">
          Free online tools,{" "}
          <span className="bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            simplify everything.
          </span>
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

        {/* Trust signals — quiet inline row */}
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

        {/* Pill badges */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {["No Signup", "No Limits", "No Cost", "Just Results"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--mg-border)] bg-[var(--mg-bg)] text-[12px] font-medium text-[var(--mg-ink-2)] shadow-[var(--mg-shadow)]"
            >
              <CircleCheck className="w-3.5 h-3.5 text-[var(--mg-brand)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
