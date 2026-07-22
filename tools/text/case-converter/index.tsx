"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";

const converters: { label: string; fn: (t: string) => string }[] = [
  { label: "UPPER CASE", fn: (t) => t.toUpperCase() },
  { label: "lower case", fn: (t) => t.toLowerCase() },
  { label: "Title Case", fn: (t) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { label: "Sentence case", fn: (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { label: "camelCase", fn: (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: "snake_case", fn: (t) => t.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "") },
  { label: "kebab-case", fn: (t) => t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "") },
];

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (label: string, fn: (t: string) => string) => {
    setActiveCase(label);
    setOutput(fn(input));
  };

  const handleCopy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Textarea
        label="Input text"
        placeholder="Type or paste your text here…"
        value={input}
        onChange={(e) => { setInput(e.target.value); setOutput(""); setActiveCase(null); }}
        className="min-h-[120px]"
      />

      <div className="flex flex-wrap gap-2">
        {converters.map(({ label, fn }) => (
          <Button
            key={label}
            variant={activeCase === label ? "primary" : "secondary"}
            size="sm"
            onClick={() => convert(label, fn)}
            disabled={!input}
          >
            {label}
          </Button>
        ))}
      </div>

      {output && (
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              label="Result"
              value={output}
              readOnly
              className="min-h-[120px] font-mono text-[13px]"
              aria-label="Converted text"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy result"}
          </Button>
        </div>
      )}
    </div>
  );
}
