import { Shield } from "lucide-react";

export function PrivacyBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--mg-success-bg)] text-[var(--mg-success-t)]"
      title="Your files never leave your browser"
    >
      <Shield className="w-3 h-3" />
      Browser-only · 100% private
    </span>
  );
}
