import Link from "next/link";
import { FileDown, FilePlus, FileImage, Maximize, ImageDown, Zap,Scissors, AlignLeft, Hash, CaseSensitive, Braces, Binary, Percent, Calendar, Activity, LucideIcon } from "lucide-react";
import { ToolBadge } from "@/components/ui/Badge";
import type { ToolMeta } from "@/types";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  FileDown, FilePlus, FileImage, Maximize, ImageDown, Zap, AlignLeft,
  Hash, CaseSensitive, Braces, Binary, Percent, Calendar, Activity, Scissors,
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  word:        { bg: "bg-[#eeeeff] dark:bg-[#1e1b4b]", color: "text-[#3730a3] dark:text-[#a5b4fc]" },
  pdf:        { bg: "bg-[#eeeeff] dark:bg-[#1e1b4b]", color: "text-[#3730a3] dark:text-[#a5b4fc]" },
  image:      { bg: "bg-[#dcfce7] dark:bg-[#052e16]", color: "text-[#14532d] dark:text-[#86efac]" },
  text:       { bg: "bg-[#fef3c7] dark:bg-[#1c1400]", color: "text-[#92400e] dark:text-[#fcd34d]" },
  developer:  { bg: "bg-[#f3e8ff] dark:bg-[#1a0533]", color: "text-[#6b21a8] dark:text-[#d8b4fe]" },
  calculator: { bg: "bg-[#fee2e2] dark:bg-[#1c0505]", color: "text-[#7f1d1d] dark:text-[#fca5a5]" },
};

interface ToolCardProps {
  tool: ToolMeta;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || Zap;
  const colors = categoryColors[tool.category] || categoryColors.pdf;
  const primaryTag = tool.tags[0];

  return (
    <Link href={`/${tool.category}/${tool.slug}`} className="group block">
      <article
        className={cn(
          "h-full p-4 bg-[var(--mg-bg)] border border-[var(--mg-border)] rounded-2xl",
          "transition-all duration-[180ms] ease-[cubic-bezier(.16,1,.3,1)]",
          "group-hover:border-[var(--mg-brand)] group-hover:shadow-[0_0_0_3px_var(--mg-brand-bg),0_4px_12px_rgba(0,0,0,.08)] group-hover:-translate-y-px",
          className
        )}
      >
        <div className="flex flex-col gap-2.5 h-full">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", colors.bg)}>
            <Icon className={cn(colors.color)} style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--mg-ink)] leading-snug">{tool.title}</h3>
            <p className="text-[12px] text-[var(--mg-ink-3)] mt-0.5 leading-relaxed line-clamp-2">{tool.tagline}</p>
          </div>
          <div className="flex items-center gap-2 mt-auto pt-1">
            {primaryTag && <ToolBadge tag={primaryTag} />}
            {tool.maxFileSize && (
              <span className="text-[11px] text-[var(--mg-ink-4)] ml-auto">{tool.maxFileSize}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="p-4 border border-[var(--mg-border)] rounded-2xl space-y-2.5">
      <div className="skeleton w-9 h-9 rounded-xl" />
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
      <div className="skeleton h-4 w-16 rounded-full" />
    </div>
  );
}
