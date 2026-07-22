"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Copy, Check, Minimize2, Maximize2, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { cn } from "@/lib/utils/cn";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--mg-ink-2)]">Input JSON</label>
          <textarea
            className={cn(
              "mg-input h-auto py-2 resize-none font-mono text-[13px] min-h-[280px] leading-relaxed",
              error && "border-[var(--mg-danger)]"
            )}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            placeholder='{"example": "paste your JSON here"}'
            spellCheck={false}
            aria-label="JSON input"
          />
          {error && (
            <p className="text-[12px] text-[var(--mg-danger)] font-mono">{error}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--mg-ink-2)]">Output</label>
          <textarea
            className="mg-input h-auto py-2 resize-none font-mono text-[13px] min-h-[280px] leading-relaxed bg-[var(--mg-bg-1)]"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here…"
            spellCheck={false}
            aria-label="Formatted JSON output"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="primary" onClick={format} disabled={!input}>
          <Maximize2 className="w-3.5 h-3.5" /> Prettify
        </Button>
        <Button variant="secondary" onClick={minify} disabled={!input}>
          <Minimize2 className="w-3.5 h-3.5" /> Minify
        </Button>
        {output && (
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy output"}
          </Button>
        )}
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(null); }} disabled={!input && !output}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </Button>
      </div>
    </div>
  );
}
