
import type { Metadata } from "next";
import { TOOL_REGISTRY, getCategoriesWithCount } from "@/lib/tools/registry";
import { CATEGORIES } from "@/config/categories";
import { ToolCard } from "@/components/tools/ToolCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Free Online Tools — Mugox",
  description:
    "Browse all free online tools on Mugox. PDF, image, text, developer, calculator tools and more — no login, browser-based, completely free.",
};

export default function AllToolsPage() {
  const categories = getCategoriesWithCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--mg-ink)] mb-2">
          All free tools
        </h1>
        <p className="text-[15px] text-[var(--mg-ink-3)]">
          {TOOL_REGISTRY.length} tools across {CATEGORIES.length} categories. No login. Nothing uploaded.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <span className="px-3 py-1.5 rounded-lg text-[13px] font-medium border border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]">
          All ({TOOL_REGISTRY.length})
        </span>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium border border-[var(--mg-border)] text-[var(--mg-ink-3)] hover:border-[var(--mg-border-2)] hover:text-[var(--mg-ink-2)] hover:bg-[var(--mg-bg-1)] transition-all duration-[180ms]"
          >
            {cat.name} ({cat.toolCount})
          </Link>
        ))}
      </div>

      {/* Tools by category */}
      {categories.map((cat) => {
        const tools = TOOL_REGISTRY.filter((t) => t.category === cat.slug);
        if (tools.length === 0) return null;
        return (
          <section key={cat.slug} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[var(--mg-ink)]">{cat.name}</h2>
              <Link
                href={`/${cat.slug}`}
                className="text-[13px] text-[var(--mg-brand)] hover:text-[var(--mg-brand-h)] transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
