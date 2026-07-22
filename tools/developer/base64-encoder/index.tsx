"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Copy, Check, ArrowDownUp } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";

export default function Base64EncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string." : "Encoding failed.");
      setOutput("");
    }
  };

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "primary" : "secondary"}
            size="sm"
            onClick={() => { setMode(m); setOutput(""); setError(null); }}
          >
            {m === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </Button>
        ))}
      </div>

      <Textarea
        label={mode === "encode" ? "Text to encode" : "Base64 to decode"}
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(null); }}
        className="min-h-[140px] font-mono text-[13px]"
        placeholder={mode === "encode" ? "Enter plain text…" : "Enter Base64 string…"}
        
      />
       {error && (
        <p className="mt-2 text-[12px] text-[var(--mg-danger)]">{error}</p>
      )}

      <div className="flex gap-2">
        <Button variant="primary" onClick={process} disabled={!input}>
          {mode === "encode" ? "Encode" : "Decode"}
        </Button>
        <Button variant="secondary" onClick={swap} disabled={!output}>
          <ArrowDownUp className="w-3.5 h-3.5" /> Swap
        </Button>
      </div>

      {output && (
        <div className="space-y-2">
          <Textarea
            label="Result"
            value={output}
            readOnly
            className="min-h-[120px] font-mono text-[13px] bg-[var(--mg-bg-1)]"
          />
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy result"}
          </Button>
        </div>
      )}
    </div>
  );
}
