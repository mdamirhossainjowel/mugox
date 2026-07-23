"use client";
import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Copy, Check, Trash2, Download } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

interface Options {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeEmpty: boolean;
}

function dedupeLines(text: string, opts: Options) {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const result: string[] = [];
  let removed = 0;

  for (const rawLine of lines) {
    const line = opts.trimWhitespace ? rawLine.trim() : rawLine;
    if (opts.removeEmpty && line.trim() === "") {
      removed++;
      continue;
    }
    const key = opts.caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    result.push(line);
  }

  return { output: result.join("\n"), removed, total: lines.length, unique: result.length };
}

export default function RemoveDuplicateLinesTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [opts, setOpts] = useState<Options>({
    caseSensitive: true,
    trimWhitespace: true,
    removeEmpty: false,
  });

  const { output, removed, total, unique } = useMemo(() => dedupeLines(text, opts), [text, opts]);

  const toggle = (key: keyof Options) => {
    setOpts((o) => ({ ...o, [key]: !o[key] }));
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      track(EVENTS.TOOL_COPIED, { tool: "remove-duplicate-lines" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    downloadFile(blob, "unique-lines.txt");
    track(EVENTS.TOOL_DOWNLOADED, { tool: "remove-duplicate-lines" });
  };

  const toggles: { key: keyof Options; label: string }[] = [
    { key: "caseSensitive", label: "Case sensitive" },
    { key: "trimWhitespace", label: "Trim whitespace" },
    { key: "removeEmpty", label: "Remove empty lines" },
  ];

  return (
    <div className="space-y-4">
      <Textarea
        label="Paste your text or list"
        placeholder={"apple\nbanana\napple\ncherry\nBanana"}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (e.target.value.length > 0) track(EVENTS.TOOL_STARTED, { tool: "remove-duplicate-lines" });
        }}
        className="min-h-[180px] font-mono text-[13px]"
      />

      <div className="flex flex-wrap gap-2">
        {toggles.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-[180ms] ${
              opts[key]
                ? "bg-[var(--mg-brand-bg)] border-[var(--mg-brand)] text-[var(--mg-brand-t)]"
                : "bg-[var(--mg-bg-1)] border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {text && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-[var(--mg-ink)] tabular-nums">{total.toLocaleString()}</p>
            <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">Total lines</p>
          </div>
          <div className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-[var(--mg-success-t)] tabular-nums">{unique.toLocaleString()}</p>
            <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">Unique lines</p>
          </div>
          <div className="bg-[var(--mg-bg-1)] border border-[var(--mg-border)] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-[var(--mg-danger-t)] tabular-nums">{removed.toLocaleString()}</p>
            <p className="text-[11px] text-[var(--mg-ink-4)] mt-0.5">Removed</p>
          </div>
        </div>
      )}

      {text && (
        <div className="space-y-2">
          <Textarea
            label="Result"
            value={output}
            readOnly
            className="min-h-[180px] font-mono text-[13px]"
            aria-label="De-duplicated text"
          />
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy result"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              Download .txt
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setText("")}>
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}