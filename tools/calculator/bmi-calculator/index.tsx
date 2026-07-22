"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600 dark:text-blue-400" };
  if (bmi < 25)   return { label: "Normal weight", color: "text-[var(--mg-success)]" };
  if (bmi < 30)   return { label: "Overweight", color: "text-[var(--mg-warn)]" };
  return                { label: "Obese", color: "text-[var(--mg-danger)]" };
}

export default function BmiCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return;
    let result: number;
    if (unit === "metric") {
      result = w / ((h / 100) * (h / 100));
    } else {
      result = (703 * w) / (h * h);
    }
    setBmi(Math.round(result * 10) / 10);
  };

  const cat = bmi !== null ? getBmiCategory(bmi) : null;
  const categories = [
    { range: "< 18.5", label: "Underweight" },
    { range: "18.5 – 24.9", label: "Normal" },
    { range: "25 – 29.9", label: "Overweight" },
    { range: "≥ 30", label: "Obese" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map((u) => (
          <Button key={u} variant={unit === u ? "primary" : "secondary"} size="sm"
            onClick={() => { setUnit(u); setBmi(null); setWeight(""); setHeight(""); }}>
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/in)"}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input id="weight" label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"} type="number" value={weight}
          onChange={(e) => { setWeight(e.target.value); setBmi(null); }} placeholder={unit === "metric" ? "70" : "154"} />
        <Input id="height" label={unit === "metric" ? "Height (cm)" : "Height (inches)"} type="number" value={height}
          onChange={(e) => { setHeight(e.target.value); setBmi(null); }} placeholder={unit === "metric" ? "175" : "69"} />
      </div>

      <Button variant="primary" onClick={calculate} disabled={!weight || !height}>
        Calculate BMI
      </Button>

      {bmi !== null && cat && (
        <div className="space-y-3">
          <div className="bg-[var(--mg-brand-bg)] border border-[var(--mg-brand)] rounded-xl p-4 text-center">
            <p className="text-[40px] font-bold text-[var(--mg-brand-t)] tabular-nums leading-none">{bmi}</p>
            <p className={cn("text-[15px] font-semibold mt-1", cat.color)}>{cat.label}</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {categories.map(({ range, label }) => (
              <div key={label} className={cn(
                "rounded-lg p-2 text-center border transition-all",
                label === cat.label
                  ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
                  : "border-[var(--mg-border)] bg-[var(--mg-bg-1)]"
              )}>
                <p className="text-[10px] font-semibold text-[var(--mg-ink-3)]">{range}</p>
                <p className="text-[11px] text-[var(--mg-ink-4)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
