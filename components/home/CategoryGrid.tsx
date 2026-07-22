import Link from "next/link";
import { FileText, Image, Type, Code, Calculator } from "lucide-react";
import type { ToolCategory } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  FileText, Image, Type, Code, Calculator,
};

interface CategoryGridProps {
  categories: (ToolCategory & { toolCount: number })[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--mg-ink)]">Browse by category</h2>
        <Link href="/tools" className="text-[13px] text-[var(--mg-brand)] hover:text-[var(--mg-brand-h)] transition-colors font-medium">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || FileText;
          return (
            <Link key={cat.slug} href={`/${cat.slug}`} className="group">
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg)] text-center transition-all duration-[180ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:border-[var(--mg-border-2)] group-hover:bg-[var(--mg-bg-1)] group-hover:-translate-y-px group-hover:shadow-[var(--mg-shadow)]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <Icon className="w-5 h-5" style={{ color: cat.textColor }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--mg-ink)] leading-tight">{cat.name}</p>
                  <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">{cat.toolCount} tools</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
