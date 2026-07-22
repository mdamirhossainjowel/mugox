"use client";

export function ToolLoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--mg-border)] border-t-[var(--mg-brand)]" />
    </div>
  );
}

export default ToolLoadingState;