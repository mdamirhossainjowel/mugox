import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--mg-bg)] border border-[var(--mg-border)] rounded-2xl",
        hover && "transition-all duration-[180ms] ease-[cubic-bezier(.16,1,.3,1)] hover:border-[var(--mg-brand)] hover:shadow-[0_0_0_3px_var(--mg-brand-bg),var(--mg-shadow-md)] hover:-translate-y-px cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SurfaceCard({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--mg-bg)] border border-[var(--mg-border)] rounded-2xl p-5 shadow-[var(--mg-shadow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
