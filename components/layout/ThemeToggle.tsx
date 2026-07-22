"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          title={label}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md transition-all duration-[180ms]",
            theme === value
              ? "bg-[var(--mg-bg)] text-[var(--mg-ink)] shadow-[var(--mg-shadow)]"
              : "text-[var(--mg-ink-4)] hover:text-[var(--mg-ink-3)]"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
