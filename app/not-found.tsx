import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchX, Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)] flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-8 h-8 text-[var(--mg-ink-4)]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--mg-ink)] mb-2">
          Page not found
        </h1>
        <p className="text-[15px] text-[var(--mg-ink-3)] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It may have moved, or you may have mistyped the URL.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="secondary">
              <Wrench className="w-4 h-4" />
              Browse tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
