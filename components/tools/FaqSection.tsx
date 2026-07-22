"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils/cn";
import { track, EVENTS } from "@/lib/analytics/track";

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null) track(EVENTS.FAQ_EXPANDED, { faq_index: i });
  };

  return (
    <div className="border border-[var(--mg-border)] rounded-2xl overflow-hidden bg-[var(--mg-bg)] shadow-[var(--mg-shadow)]">
      {faqs.map((faq, i) => (
        <div key={i} className={cn(i > 0 && "border-t border-[var(--mg-border)]")}>
          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left gap-4 hover:bg-[var(--mg-bg-1)] transition-colors duration-[180ms]"
            onClick={() => toggle(i)}
            aria-expanded={open === i}
          >
            <span className="text-[14px] font-medium text-[var(--mg-ink)]">{faq.q}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[var(--mg-ink-4)] shrink-0 transition-transform duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)]",
                open === i && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              open === i ? "max-h-64" : "max-h-0"
            )}
          >
            <p className="px-5 pb-4 text-[13px] text-[var(--mg-ink-3)] leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
