"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";

function calc1(x: number, pct: number) { return (x * pct) / 100; }
function calc2(part: number, total: number) { return total === 0 ? 0 : (part / total) * 100; }
function calc3(a: number, b: number) { return a === 0 ? 0 : ((b - a) / a) * 100; }

export default function PercentageCalculatorTool() {
  const [v1a, setV1a] = useState(""); const [v1b, setV1b] = useState("");
  const [v2a, setV2a] = useState(""); const [v2b, setV2b] = useState("");
  const [v3a, setV3a] = useState(""); const [v3b, setV3b] = useState("");

  const r1 = v1a && v1b ? calc1(+v1a, +v1b) : null;
  const r2 = v2a && v2b ? calc2(+v2a, +v2b) : null;
  const r3 = v3a && v3b ? calc3(+v3a, +v3b) : null;

  const ResultBox = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-[var(--mg-brand-bg)] border border-[var(--mg-brand)] rounded-xl px-4 py-3">
      <p className="text-[22px] font-bold text-[var(--mg-brand-t)] tabular-nums">{value % 1 === 0 ? value : value.toFixed(4)}</p>
      <p className="text-[12px] text-[var(--mg-brand-t)] opacity-70">{label}</p>
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-[var(--mg-border)] rounded-xl p-4 space-y-3">
      <p className="text-[13px] font-semibold text-[var(--mg-ink-2)]">{title}</p>
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="What is X% of Y?">
        <div className="flex items-center gap-2 flex-wrap">
          <Input id="v1a" type="number" value={v1a} onChange={(e) => setV1a(e.target.value)} placeholder="X (%)" className="w-28" aria-label="Percentage X" />
          <span className="text-[var(--mg-ink-3)] text-[13px]">% of</span>
          <Input id="v1b" type="number" value={v1b} onChange={(e) => setV1b(e.target.value)} placeholder="Y" className="w-28" aria-label="Number Y" />
        </div>
        {r1 !== null && <ResultBox value={r1} label={`${v1a}% of ${v1b}`} />}
      </Section>

      <Section title="X is what % of Y?">
        <div className="flex items-center gap-2 flex-wrap">
          <Input id="v2a" type="number" value={v2a} onChange={(e) => setV2a(e.target.value)} placeholder="X (part)" className="w-28" aria-label="Part X" />
          <span className="text-[var(--mg-ink-3)] text-[13px]">is what % of</span>
          <Input id="v2b" type="number" value={v2b} onChange={(e) => setV2b(e.target.value)} placeholder="Y (total)" className="w-28" aria-label="Total Y" />
        </div>
        {r2 !== null && <ResultBox value={r2} label="%" />}
      </Section>

      <Section title="Percentage change from A to B">
        <div className="flex items-center gap-2 flex-wrap">
          <Input id="v3a" type="number" value={v3a} onChange={(e) => setV3a(e.target.value)} placeholder="From (A)" className="w-28" aria-label="From value" />
          <span className="text-[var(--mg-ink-3)] text-[13px]">to</span>
          <Input id="v3b" type="number" value={v3b} onChange={(e) => setV3b(e.target.value)} placeholder="To (B)" className="w-28" aria-label="To value" />
        </div>
        {r3 !== null && (
          <div className="bg-[var(--mg-brand-bg)] border border-[var(--mg-brand)] rounded-xl px-4 py-3">
            <p className="text-[22px] font-bold text-[var(--mg-brand-t)] tabular-nums">
              {r3 >= 0 ? "+" : ""}{r3.toFixed(2)}%
            </p>
            <p className="text-[12px] text-[var(--mg-brand-t)] opacity-70">
              {r3 >= 0 ? "Increase" : "Decrease"}
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
