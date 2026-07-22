import type { ToolMeta } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolBadge } from "@/components/ui/Badge";
import { RelatedTools } from "./RelatedTools";
import { FaqSection } from "./FaqSection";
import { PrivacyBadge } from "./PrivacyBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolWebAppSchema, faqSchema, breadcrumbSchema } from "@/lib/seo/generateJsonLd";
import { getCategoryBySlug } from "@/config/categories";

interface ToolShellProps {
  tool: ToolMeta;
  relatedTools: ToolMeta[];
  children: React.ReactNode;
}

export function ToolShell({ tool, relatedTools, children }: ToolShellProps) {
  const category = getCategoryBySlug(tool.category);
  const categoryName = category?.name || tool.category;

  return (
    <>
      <JsonLd schema={toolWebAppSchema(tool)} />
      {tool.faqs.length > 0 && <JsonLd schema={faqSchema(tool)} />}
      <JsonLd schema={breadcrumbSchema(tool, categoryName)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <div className="mb-5">
          <Breadcrumbs
            crumbs={[
              { label: "Mugox", href: "/" },
              { label: categoryName, href: `/${tool.category}` },
              { label: tool.title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Main content */}
          <main>
            {/* Tool header */}
            <div className="mb-6">
              <div className="flex items-start gap-3 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--mg-ink)]">
                  {tool.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  {tool.tags.slice(0, 2).map((tag) => (
                    <ToolBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <p className="text-[15px] text-[var(--mg-ink-3)] leading-relaxed max-w-xl">{tool.tagline}</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <PrivacyBadge />
                {tool.maxFileSize && (
                  <span className="text-[12px] text-[var(--mg-ink-4)]">Up to {tool.maxFileSize}</span>
                )}
                {tool.acceptedFormats && (
                  <span className="text-[12px] text-[var(--mg-ink-4)]">
                    Accepts: {tool.acceptedFormats.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* The tool widget */}
            <div className="bg-[var(--mg-bg)] border border-[var(--mg-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--mg-shadow)] mb-8">
              {children}
            </div>

            {/* FAQ */}
            {tool.faqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight mb-4 text-[var(--mg-ink)]">
                  Frequently asked questions
                </h2>
                <FaqSection faqs={tool.faqs} />
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="lg:sticky lg:top-20">
              <RelatedTools tools={relatedTools} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
