import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { TOOL_REGISTRY, getToolBySlug, getRelatedTools } from "@/lib/tools/registry";
import { CATEGORIES } from "@/config/categories";
import { generateToolMetadata } from "@/lib/seo/generateMetadata";
import { ToolShell } from "@/components/tools/ToolShell";
import { Loader2 } from "lucide-react";

// Dynamically import every tool so heavy libraries only load when needed
const toolComponents: Record<string, React.ComponentType> = {
  // PDF tools
  "compress-pdf":   dynamic(() => import("@/tools/pdf/compress-pdf"),   { loading: () => <ToolLoadingState /> }),
  "merge-pdf":      dynamic(() => import("@/tools/pdf/merge-pdf"),      { loading: () => <ToolLoadingState /> }),
  "pdf-to-jpg":     dynamic(() => import("@/tools/pdf/pdf-to-jpg"),     {  loading: () => <ToolLoadingState /> }), 
  "split-pdf":   dynamic(() => import("@/tools/pdf/split-pdf"),   { loading: () => <ToolLoadingState /> }),
  "images-to-pdf":      dynamic(() => import("@/tools/pdf/images-to-pdf"),      { loading: () => <ToolLoadingState /> }),
  "delete-pdf-pages":     dynamic(() => import("@/tools/pdf/delete-pdf-pages"),     {  loading: () => <ToolLoadingState /> }),
  "rotate-pdf":     dynamic(() => import("@/tools/pdf/rotate-pdf"),     {  loading: () => <ToolLoadingState /> }),
  "word-to-pdf":     dynamic(() => import("@/tools/pdf/word-to-pdf"),     {  loading: () => <ToolLoadingState /> }),
  "pdf-ocr":     dynamic(() => import("@/tools/pdf/pdf-ocr"),     {  loading: () => <ToolLoadingState /> }),
  "pdf-to-word":     dynamic(() => import("@/tools/pdf/pdf-to-word"),     {  loading: () => <ToolLoadingState /> }),
 // "unlockpdf":     dynamic(() => import("@/tools/pdf/unlockpdf"),     {  loading: () => <ToolLoadingState /> }),
 // "protectpdf":     dynamic(() => import("@/tools/pdf/protectpdf"),     {  loading: () => <ToolLoadingState /> }),

  // Image tools
  "resize-image":   dynamic(() => import("@/tools/image/resize-image"), { loading: () => <ToolLoadingState /> }),
  "compress-image": dynamic(() => import("@/tools/image/compress-image"),{  loading: () => <ToolLoadingState /> }),
  "convert-to-webp":dynamic(() => import("@/tools/image/convert-to-webp"),{  loading: () => <ToolLoadingState /> }),
  //"background-remove-image":dynamic(() => import("@/tools/image/background-remove-image"),{  loading: () => <ToolLoadingState /> }),
  // Text tools
  "word-counter":   dynamic(() => import("@/tools/text/word-counter"),  {  loading: () => <ToolLoadingState /> }),
  "character-counter": dynamic(() => import("@/tools/text/character-counter"), {  loading: () => <ToolLoadingState /> }),
  "case-converter": dynamic(() => import("@/tools/text/case-converter"),{  loading: () => <ToolLoadingState /> }),
  // Developer tools
  "json-formatter": dynamic(() => import("@/tools/developer/json-formatter"), {  loading: () => <ToolLoadingState /> }),
  "base64-encoder": dynamic(() => import("@/tools/developer/base64-encoder"), {  loading: () => <ToolLoadingState /> }),
  // Calculators
  "percentage-calculator": dynamic(() => import("@/tools/calculator/percentage-calculator"), {  loading: () => <ToolLoadingState /> }),
  "age-calculator": dynamic(() => import("@/tools/calculator/age-calculator"), {  loading: () => <ToolLoadingState /> }),
  "bmi-calculator": dynamic(() => import("@/tools/calculator/bmi-calculator"), {  loading: () => <ToolLoadingState /> }),
};

function ToolLoadingState() {
  return (
    <div className="flex items-center justify-center py-16 gap-2 text-[var(--mg-ink-4)]">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-[13px]">Loading tool…</span>
    </div>
  );
}

function ToolNotImplemented({ slug }: { slug: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[15px] text-[var(--mg-ink-3)]">
        This tool is coming soon. ({slug})
      </p>
    </div>
  );
}

export async function generateStaticParams() {
  return TOOL_REGISTRY.map((tool) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}): Promise<Metadata> {
  const { tool: toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);
  if (!tool) return {};
  return generateToolMetadata(tool);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category, tool: toolSlug } = await params;

  // Validate category exists
  const validCategory = CATEGORIES.find((c) => c.slug === category);
  if (!validCategory) notFound();

  // Validate tool exists
  const tool = getToolBySlug(toolSlug);
  if (!tool || tool.category !== category) notFound();

  const relatedTools = getRelatedTools(tool);
  const ToolComponent = toolComponents[tool.slug];

  return (
    <ToolShell tool={tool} relatedTools={relatedTools}>
      {ToolComponent ? (
        <ToolComponent />
      ) : (
        <ToolNotImplemented slug={tool.slug} />
      )}
    </ToolShell>
  );
}
