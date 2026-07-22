interface StatsBarProps {
  toolCount: number;
}

export function StatsBar({ toolCount }: StatsBarProps) {
  const stats = [
    { value: `${toolCount}+`, label: "Free tools" },
    { value: "0", label: "Files uploaded to servers" },
    { value: "0", label: "Account required" },
    { value: "100%", label: "Browser-based" },
  ];

  return (
    <div className="border-y border-[var(--mg-border)] bg-[var(--mg-bg-1)] py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-[var(--mg-ink)] tracking-tight">{stat.value}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
