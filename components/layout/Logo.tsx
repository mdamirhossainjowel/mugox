import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * MugoX brand mark: an "M" stroke resolving into a wrench-accented "X",
 * rendered as a gradient badge. Scales cleanly at any size (header, footer,
 * favicon-adjacent contexts) since it's pure SVG, no raster asset.
 */
export function Logo({ size = 28, showWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
     <Image
  src="/images/logo.png" // Change this to your logo path
  alt="MugoX"
  width={size}
  height={size}
  className="object-contain"
  priority
/>
      {showWordmark && (
        <span className="font-bold text-[17px] tracking-tight leading-none">
          <span className="text-[var(--mg-ink)]">Mugo</span>
          <span className="bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            X
          </span>
        </span>
      )}
    </span>
  );
}
