"use client";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-[var(--mg-brand)] text-white hover:bg-[var(--mg-brand-h)] border-transparent",
  secondary: "bg-[var(--mg-bg-1)] text-[var(--mg-ink-2)] border-[var(--mg-border-2)] hover:bg-[var(--mg-bg-2)]",
  ghost: "bg-transparent text-[var(--mg-ink-2)] border-transparent hover:bg-[var(--mg-bg-1)]",
  danger: "bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] border-transparent hover:bg-[var(--mg-danger)] hover:text-white",
};

const sizeStyles = {
  sm: "h-7 px-2.5 text-xs rounded-[var(--mg-r-sm)]",
  md: "h-9 px-4 text-[13px] rounded-[var(--mg-r)]",
  lg: "h-11 px-6 text-[15px] rounded-[var(--mg-r)]",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium border transition-all duration-[180ms] ease-[cubic-bezier(.16,1,.3,1)] active:scale-[.97] disabled:opacity-40 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
