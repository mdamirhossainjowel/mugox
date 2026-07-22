import { cn } from "@/lib/utils/cn";
import type { ToolTag } from "@/types";

const tagStyles: Record<ToolTag, string> = {
  popular: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  featured: "bg-brand-50 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
  new: "bg-brand-50 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
  "pro-quality": "bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  hot: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300",
};

const tagLabels: Record<ToolTag, string> = {
  popular: "Popular",
  featured: "Featured",
  new: "New",
  "pro-quality": "Pro Quality",
  hot: "Hot",
};

interface BadgeProps {
  tag: ToolTag;
  className?: string;
}

export function ToolBadge({ tag, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide",
        tagStyles[tag],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {tagLabels[tag]}
    </span>
  );
}

interface InfoBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoBadge({ children, className }: InfoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--mg-bg-2)] text-[var(--mg-ink-3)]",
        className
      )}
    >
      {children}
    </span>
  );
}
