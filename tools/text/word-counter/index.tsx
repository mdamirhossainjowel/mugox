"use client";
import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Copy, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { track, EVENTS } from "@/lib/analytics/track";

function analyzeText(text: string) {
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+\s*/).filter(Boolean).length;
  const paragraphs = trimmed === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length || (trimmed ? 1 : 0);
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
}

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      track(EVENTS.TOOL_COPIED, { tool: "word-counter" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statItems = [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Characters", value: stats.chars.toLocaleString() },
    { label: "No spaces", value: stats.charsNoSpaces.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Read time", value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          id="text-input"
          placeholder="Paste or type your text here…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.length > 0) track(EVENTS.TOOL_STARTED, { tool: "word-counter" });
          }}
          className="min-h-[220px] text-[14px]"
          aria-label="Text to analyze"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center"
          >
            <p className="text-lg font-bold text-[var(--mg-ink)] tabular-nums">{item.value}</p>
            <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {text && (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy text"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setText("")}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
