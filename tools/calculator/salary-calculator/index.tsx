"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SalaryCalculator() {
  const [monthly, setMonthly] = useState("");

  const result = useMemo(() => {
    const salary = Number(monthly);

    if (isNaN(salary) || salary <= 0) {
      return null;
    }

    return {
      yearly: salary * 12,
      weekly: salary * 12 / 52,
      daily: salary * 12 / 260,
      hourly: salary * 12 / (260 * 8),
    };
  }, [monthly]);

  return (
    <div className="space-y-6">

      <input
        type="number"
        placeholder="Monthly Salary"
        value={monthly}
        onChange={(e) => setMonthly(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      {result && (
        <div className="rounded-xl border p-5 space-y-4">

          <div className="flex justify-between">
            <span>Yearly Salary</span>
            <strong>${result.yearly.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Weekly Salary</span>
            <strong>${result.weekly.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Daily Salary</span>
            <strong>${result.daily.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between text-lg">
            <span>Hourly Wage</span>
            <strong>${result.hourly.toFixed(2)}</strong>
          </div>

        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => setMonthly("")}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}