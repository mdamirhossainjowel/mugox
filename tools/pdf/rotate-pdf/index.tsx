"use client";
import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { RotateCcw, RotateCw, Loader2, AlertCircle, Download } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";

const MAX = 50 * 1024 * 1024;

const ANGLE_OPTIONS = [
  { value: 90, label: "90° clockwise" },
  { value: 180, label: "180°" },
  { value: 270, label: "90° counter-clockwise" },
] as const;

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setDone(false);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "rotate-pdf" });
  }, []);

  const rotate = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      for (const page of doc.getPages()) {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      }

      const outBytes = await doc.save();
      const blob = bytesToBlob(outBytes, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "-rotated.pdf");
      a.click();
      URL.revokeObjectURL(url);

      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "rotate-pdf" });
    } catch {
      setError("Couldn't rotate this PDF — it may be corrupted or password-protected.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setDone(false); setError(null); };

  return (
    <div className="space-y-5">
      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept="application/pdf,.pdf"
          maxSize={MAX}
          label="Drop your PDF here"
          hint="PDF only · up to 50MB"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)]">{formatBytes(file.size)}</p>
            </div>
          </div>

          <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
            <p className="text-xs font-semibold text-[var(--mg-ink-2)] mb-2">Rotate all pages</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {ANGLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAngle(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border transition-all duration-[180ms] ${
                    angle === opt.value
                      ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]"
                      : "border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {done && !error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
              ✓ Rotated PDF downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={rotate} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Rotate PDF
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="w-3.5 h-3.5" />
              New file
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
