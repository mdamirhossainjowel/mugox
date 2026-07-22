"use client";
import { useRef, useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatBytes } from "@/lib/utils/formatBytes";

interface ToolDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSize?: number; // bytes
  label?: string;
  hint?: string;
}

export function ToolDropzone({ onFile, accept = "*", maxSize, label, hint }: ToolDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (maxSize && file.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatBytes(maxSize)}.`);
      return;
    }
    onFile(file);
  }, [onFile, maxSize]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer select-none",
          "transition-all duration-[180ms] ease-[cubic-bezier(.16,1,.3,1)]",
          dragging
            ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] scale-[1.01]"
            : "border-[var(--mg-border-2)] hover:border-[var(--mg-brand)] hover:bg-[var(--mg-bg-1)]"
        )}
        aria-label="Drop file here or click to browse"
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-[180ms]",
          dragging ? "bg-[var(--mg-brand-bg)]" : "bg-[var(--mg-bg-1)] border border-[var(--mg-border)]"
        )}>
          {dragging
            ? <FileText className="w-6 h-6 text-[var(--mg-brand)]" />
            : <Upload className="w-6 h-6 text-[var(--mg-ink-4)]" />
          }
        </div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[var(--mg-ink)]">
            {label || "Drop your file here"}
          </p>
          <p className="text-[13px] text-[var(--mg-ink-3)] mt-0.5">
            {hint || "or click to browse"}
          </p>
          {maxSize && (
            <p className="text-[12px] text-[var(--mg-ink-4)] mt-1">
              Maximum file size: {formatBytes(maxSize)}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-[12px] text-[var(--mg-danger)]">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        aria-hidden="true"
      />
    </div>
  );
}
