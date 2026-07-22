"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";

function calcAge(dob: Date, at: Date) {
  let years = at.getFullYear() - dob.getFullYear();
  let months = at.getMonth() - dob.getMonth();
  let days = at.getDate() - dob.getDate();
  if (days < 0) { months--; const d = new Date(at.getFullYear(), at.getMonth(), 0); days += d.getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((at.getTime() - dob.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  return { years, months, days, totalDays, totalWeeks, totalMonths };
}

export default function AgeCalculatorTool() {
  const today = new Date().toISOString().split("T")[0];
  const [dob, setDob] = useState("");
  const [at, setAt] = useState(today);
  const [result, setResult] = useState<ReturnType<typeof calcAge> | null>(null);

  const calculate = () => {
    if (!dob) return;
    const d = new Date(dob);
    const a = new Date(at);
    if (isNaN(d.getTime()) || isNaN(a.getTime()) || d > a) return;
    setResult(calcAge(d, a));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input id="dob" label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={today} />
        <Input id="at" label="Age at date" type="date" value={at} onChange={(e) => setAt(e.target.value)} max={today} />
      </div>

      <Button variant="primary" onClick={calculate} disabled={!dob}>
        <Calendar className="w-3.5 h-3.5" /> Calculate age
      </Button>

      {result && (
        <div className="space-y-3">
          <div className="bg-[var(--mg-brand-bg)] border border-[var(--mg-brand)] rounded-xl p-4 text-center">
            <p className="text-[32px] font-bold text-[var(--mg-brand-t)] tabular-nums leading-none">
              {result.years} <span className="text-[20px]">years</span>{" "}
              {result.months} <span className="text-[20px]">months</span>{" "}
              {result.days} <span className="text-[20px]">days</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total days", value: result.totalDays.toLocaleString() },
              { label: "Total weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total months", value: result.totalMonths.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center">
                <p className="text-[16px] font-bold text-[var(--mg-ink)] tabular-nums">{value}</p>
                <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
