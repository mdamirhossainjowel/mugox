"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GstVatCalculator() {
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("15");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    const a = Number(amount);
    const t = Number(tax);

    if (isNaN(a) || isNaN(t) || a <= 0) return null;

    if (mode === "add") {
      const taxAmount = (a * t) / 100;

      return {
        base: a,
        tax: taxAmount,
        total: a + taxAmount,
      };
    }

    const base = a / (1 + t / 100);
    const taxAmount = a - base;

    return {
      base,
      tax: taxAmount,
      total: a,
    };
  }, [amount, tax, mode]);

  return (
    <div className="space-y-6">

      <div className="flex gap-2">

        <button
          onClick={() => setMode("add")}
          className={`flex-1 rounded-xl py-2 border ${
            mode === "add"
              ? "bg-[var(--mg-brand-bg)] border-[var(--mg-brand)]"
              : ""
          }`}
        >
          Add GST/VAT
        </button>

        <button
          onClick={() => setMode("remove")}
          className={`flex-1 rounded-xl py-2 border ${
            mode === "remove"
              ? "bg-[var(--mg-brand-bg)] border-[var(--mg-brand)]"
              : ""
          }`}
        >
          Remove GST/VAT
        </button>

      </div>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="number"
        placeholder="GST/VAT %"
        value={tax}
        onChange={(e) => setTax(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />

      {result && (
        <div className="rounded-xl border p-5 space-y-3">

          <div className="flex justify-between">
            <span>Base Amount</span>
            <strong>${result.base.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>GST / VAT</span>
            <strong>${result.tax.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between text-lg">
            <span>Total</span>
            <strong>${result.total.toFixed(2)}</strong>
          </div>

        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => {
          setAmount("");
          setTax("15");
        }}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}