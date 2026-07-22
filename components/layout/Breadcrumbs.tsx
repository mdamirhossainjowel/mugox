import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--mg-ink-4)]" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-[12px] text-[var(--mg-ink-4)] hover:text-[var(--mg-ink-3)] transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[12px] text-[var(--mg-ink-3)]" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
