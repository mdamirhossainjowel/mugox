"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/Input";

export default function CharacterCounterTool() {
  const [text, setText] = useState("");

  const chars = text.length;
  const noSpaces = text.replace(/\s/g, "").length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Type or paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] text-[14px]"
        aria-label="Text to count"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Characters", value: chars },
          { label: "Without spaces", value: noSpaces },
          { label: "Words", value: words },
          { label: "Lines", value: lines },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-[var(--mg-ink)] tabular-nums">{value.toLocaleString()}</p>
            <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
