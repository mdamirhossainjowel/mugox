
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/config/categories";
import { CATEGORIES } from "@/config/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { generateCategoryMetadata } from "@/lib/seo/generateMetadata";
import { ToolCard } from "@/components/tools/ToolCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FileText, Image, Type, Code, Calculator } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  FileText, Image, Type, Code, Calculator,
};

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return generateCategoryMetadata(cat.name, cat.slug, cat.description);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const tools = getToolsByCategory(category);
  const Icon = iconMap[cat.icon] || FileText;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[{ label: "Mugox", href: "/" }, { label: cat.name }]}
        />
      </div>

      {/* Category header */}
      <div className="flex items-start gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: cat.bgColor }}
        >
          <Icon style={{ width: 22, height: 22, color: cat.textColor }} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--mg-ink)] mb-1">
            {cat.name}
          </h1>
          <p className="text-[15px] text-[var(--mg-ink-3)] max-w-xl">{cat.description}</p>
          <p className="text-[13px] text-[var(--mg-ink-4)] mt-1">{tools.length} free tools</p>
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--mg-border)] rounded-2xl">
          <p className="text-[15px] text-[var(--mg-ink-3)]">Tools coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
