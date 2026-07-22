import type { ToolMeta } from "@/types";
import { ToolCard } from "@/components/tools/ToolCard";
import Link from "next/link";

interface FeaturedToolsProps {
  tools: ToolMeta[];
  title?: string;
}

export function FeaturedTools({ tools, title = "Popular tools" }: FeaturedToolsProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--mg-ink)]">{title}</h2>
        <Link href="/tools" className="text-[13px] text-[var(--mg-brand)] hover:text-[var(--mg-brand-h)] transition-colors font-medium">
          All tools →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
