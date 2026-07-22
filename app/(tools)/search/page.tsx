"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchTools } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolCardSkeleton } from "@/components/tools/ToolCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(
    () => (debouncedQuery.trim() ? searchTools(debouncedQuery.trim()) : []),
    [debouncedQuery]
  );

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--mg-ink)] mb-5">
          Search tools
        </h1>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mg-ink-4)] pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 14+ free tools…"
            className="w-full h-12 pl-11 pr-10 rounded-2xl border border-[var(--mg-border-2)] bg-[var(--mg-bg)] text-[var(--mg-ink)] text-[15px] font-[inherit] outline-none transition-all duration-[180ms] focus:border-[var(--mg-brand)] focus:shadow-[0_0_0_3px_rgba(91,94,244,.12),0_4px_12px_rgba(0,0,0,.08)] placeholder:text-[var(--mg-ink-4)]"
            aria-label="Search tools"
            role="searchbox"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[var(--mg-ink-4)] hover:text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {!mounted ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <ToolCardSkeleton key={i} />)}
        </div>
      ) : showResults ? (
        results.length > 0 ? (
          <>
            <p className="text-[13px] text-[var(--mg-ink-4)] mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-[16px] font-semibold text-[var(--mg-ink)] mb-2">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <p className="text-[13px] text-[var(--mg-ink-4)]">
              Try a different keyword — e.g. &ldquo;pdf&rdquo;, &ldquo;resize&rdquo;, &ldquo;json&rdquo;
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <p className="text-[15px] text-[var(--mg-ink-3)]">
            Type to search across all free tools…
          </p>
        </div>
      )}
    </div>
  );
}
