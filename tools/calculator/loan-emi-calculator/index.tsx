"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoanEmiCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const P = Number(amount);
    const annualRate = Number(rate);
    const Y = Number(years);

    if (
      isNaN(P) ||
      isNaN(annualRate) ||
      isNaN(Y) ||
      P <= 0 ||
      annualRate <= 0 ||
      Y <= 0
    ) {
      return null;
    }

    const r = annualRate / 12 / 100;
    const n = Y * 12;

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi,
      totalInterest,
      totalPayment,
    };
  }, [amount, rate, years]);

  return (
    <div className="space-y-6">

      <input
        type="number"
        placeholder="Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="number"
        placeholder="Annual Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="number"
        placeholder="Loan Tenure (Years)"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      {result && (
        <div className="rounded-xl border p-5 space-y-4">

          <div className="flex justify-between">
            <span>Monthly EMI</span>
            <strong>${result.emi.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Total Interest</span>
            <strong>${result.totalInterest.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between text-lg">
            <span>Total Repayment</span>
            <strong>${result.totalPayment.toFixed(2)}</strong>
          </div>

        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => {
          setAmount("");
          setRate("");
          setYears("");
        }}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}