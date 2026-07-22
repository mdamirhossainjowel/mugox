"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const navLinks = [
  { href: "/tools", label: "All tools" },
  { href: "/pdf", label: "PDF" },
  { href: "/image", label: "Image" },
  { href: "/text", label: "Text" },
  { href: "/developer", label: "Dev" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--mg-bg)]/90 backdrop-blur-xl border-b border-[var(--mg-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Mugox home">
            <Logo size={30} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-[180ms]",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-[var(--mg-bg-1)] text-[var(--mg-ink)]"
                    : "text-[var(--mg-ink-3)] hover:text-[var(--mg-ink-2)] hover:bg-[var(--mg-bg-1)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Theme */}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/search" aria-label="Search tools">
              <button className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--mg-border-2)] bg-[var(--mg-bg-1)] text-[var(--mg-ink-4)] text-[13px] hover:border-[var(--mg-brand)]/40 hover:bg-[var(--mg-bg-2)] hover:shadow-[0_0_0_3px_rgba(99,102,241,.08)] transition-all duration-[180ms] min-w-[170px]">
                <Search className="w-3.5 h-3.5" />
                <span>Search tools…</span>
                <span className="ml-auto flex gap-0.5">
                  <kbd className="text-[10px] px-1 py-0.5 rounded border border-[var(--mg-border-2)] bg-[var(--mg-bg)]">⌘</kbd>
                  <kbd className="text-[10px] px-1 py-0.5 rounded border border-[var(--mg-border-2)] bg-[var(--mg-bg)]">K</kbd>
                </span>
              </button>
            </Link>
            <ThemeToggle />
            {/* Mobile menu */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-1)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--mg-border)] py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-[13px] font-medium text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-1)] hover:text-[var(--mg-ink-2)]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-[13px] font-medium text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-1)]">
              Search tools
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
