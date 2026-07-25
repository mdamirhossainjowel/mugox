"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DiscountCalculatorTool() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const result = useMemo(() => {
    const p = Number(price);
    const d = Number(discount);

    if (isNaN(p) || isNaN(d) || p <= 0 || d < 0) {
      return null;
    }

    const saved = (p * d) / 100;
    const finalPrice = p - saved;

    return {
      saved,
      finalPrice,
    };
  }, [price, discount]);

  const reset = () => {
    setPrice("");
    setDiscount("");
  };

  return (
    <div className="space-y-6">

      <div className="grid gap-4">

        <div>
          <label className="block text-sm font-medium mb-2">
            Original Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="100"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Discount (%)
          </label>

          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="20"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3">

          <div className="flex justify-between">
            <span>You Save</span>
            <strong>${result.saved.toFixed(2)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Final Price</span>
            <strong>${result.finalPrice.toFixed(2)}</strong>
          </div>

        </div>
      )}

      <Button variant="ghost" onClick={reset}>
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}