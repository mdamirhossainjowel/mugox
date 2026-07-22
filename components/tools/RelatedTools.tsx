import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ToolMeta } from "@/types";
import { ToolCard } from "./ToolCard";

export function RelatedTools({ tools }: { tools: ToolMeta[] }) {
  if (tools.length === 0) return null;
  return (
    <div>
      <h3 className="text-[12px] font-bold uppercase tracking-widest text-[var(--mg-ink-4)] mb-3">
        Related tools
      </h3>
      <div className="space-y-2">
        {tools.slice(0, 6).map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.category}/${tool.slug}`}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] hover:border-[var(--mg-border-2)] hover:bg-[var(--mg-bg-1)] transition-all duration-[180ms] group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--mg-ink)] truncate">{tool.title}</p>
              <p className="text-[11px] text-[var(--mg-ink-4)] truncate">{tool.tagline}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--mg-ink-4)] shrink-0 group-hover:text-[var(--mg-brand)] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
