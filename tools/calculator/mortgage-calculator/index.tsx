"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MortgageCalculator() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const P = Number(amount);
    const annual = Number(interest);
    const Y = Number(years);

    if (
      isNaN(P) ||
      isNaN(annual) ||
      isNaN(Y) ||
      P <= 0 ||
      annual <= 0 ||
      Y <= 0
    ) {
      return null;
    }

    const r = annual / 12 / 100;
    const n = Y * 12;

    const payment =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = payment * n;
    const totalInterest = totalPayment - P;

    return {
      payment,
      totalPayment,
      totalInterest,
    };
  }, [amount, interest, years]);

  return (
    <div className="space-y-6">

      <input
        type="number"
        placeholder="Mortgage Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="number"
        placeholder="Annual Interest Rate (%)"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="number"
        placeholder="Loan Term (Years)"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      {result && (
        <div className="rounded-xl border p-5 space-y-4">

          <div className="flex justify-between">
            <span>Monthly Payment</span>
            <strong>${result.payment.toFixed(2)}</strong>
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
          setInterest("");
          setYears("");
        }}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}