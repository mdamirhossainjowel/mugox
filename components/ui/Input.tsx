"use client";
import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-[var(--mg-ink-2)]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "mg-input",
          error && "border-[var(--mg-danger)] focus:shadow-[0_0_0_3px_rgba(220,38,38,.12)]",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-[11px] text-[var(--mg-ink-4)]">{hint}</p>}
      {error && <p className="text-[11px] text-[var(--mg-danger)]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-[var(--mg-ink-2)]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "mg-input h-auto py-2 resize-y leading-relaxed",
          className
        )}
        {...props}
      />
      {hint && <p className="text-[11px] text-[var(--mg-ink-4)]">{hint}</p>}
    </div>
  );
}
