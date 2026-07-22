
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { StatsBar } from "@/components/home/StatsBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteSchema } from "@/lib/seo/generateJsonLd";
import { getCategoriesWithCount, getPopularTools, TOOL_REGISTRY } from "@/lib/tools/registry";

export default function HomePage() {
  const categories = getCategoriesWithCount();
  const popularTools = getPopularTools(8);

  return (
    <>
      <JsonLd schema={websiteSchema()} />

      <Hero />

      <StatsBar toolCount={TOOL_REGISTRY.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <CategoryGrid categories={categories} />
        <FeaturedTools tools={popularTools} title="Popular tools" />
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-[var(--mg-border)] bg-[var(--mg-bg-1)] py-16 mt-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--mg-ink)] mb-3">
            Everything runs in your browser
          </h2>
          <p className="text-[15px] text-[var(--mg-ink-3)] leading-relaxed">
            No uploads. No accounts. No waiting. Every Mugox tool processes your files
            locally using JavaScript — your data never touches our servers.
          </p>
        </div>
      </section>
    </>
  );
}
