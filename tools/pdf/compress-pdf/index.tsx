"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Loader2, AlertCircle, Download, Info } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { loadPdfDocument, renderPageToBlob, bytesToBlob } from "@/lib/pdf/pdfjsClient";

const MAX = 50 * 1024 * 1024;

type Level = "low" | "medium" | "high";

const levelLabels: Record<Level, string> = {
  low: "Low (best quality)",
  medium: "Medium (balanced)",
  high: "High (smallest file)",
};

// Rendering DPI-ish scale and JPEG quality per level. Higher compression =
// lower resolution + lower JPEG quality = smaller file, softer image.
const LEVEL_SETTINGS: Record<Level, { scale: number; quality: number }> = {
  low: { scale: 2, quality: 0.92 },
  medium: { scale: 1.5, quality: 0.75 },
  high: { scale: 1, quality: 0.55 },
};

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setDone(false);
    setResultSize(null);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "compress-pdf" });
  }, []);

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDone(false);
    setResultSize(null);

    try {
      const { scale, quality } = LEVEL_SETTINGS[level];
      const srcPdf = await loadPdfDocument(file);
      const pageCount = srcPdf.numPages;

      const outPdf = await PDFDocument.create();

      for (let i = 1; i <= pageCount; i++) {
        setProgress({ page: i, total: pageCount });
        const blob = await renderPageToBlob(srcPdf, i, scale, "image/jpeg", quality);
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const jpg = await outPdf.embedJpg(bytes);
        const page = outPdf.addPage([jpg.width, jpg.height]);
        page.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
      }

      const outBytes = await outPdf.save();
      const blob = bytesToBlob(outBytes, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "-compressed.pdf");
      a.click();
      URL.revokeObjectURL(url);

      setResultSize(outBytes.byteLength);
      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "compress-pdf" });
    } catch {
      setError("Something went wrong compressing this PDF. Please try another file.");
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setResultSize(null);
    setError(null);
  };

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
          {/* File info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)]">{formatBytes(file.size)}</p>
            </div>
          </div>

          {/* Compression level */}
          <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
            <p className="text-xs font-semibold text-[var(--mg-ink-2)] mb-2">Compression level</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {(["low", "medium", "high"] as Level[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-medium border transition-all duration-[180ms] text-left ${
                    level === l
                      ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]"
                      : "border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
                  }`}
                >
                  {levelLabels[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Honest disclosure — this is a real quality tradeoff, not a bug */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Compression re-renders each page as an image, so file size drops a lot but text
              becomes non-selectable in the output. Best for PDFs you just need to view or share.
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Progress */}
          {processing && progress && (
            <p className="text-[12px] text-[var(--mg-ink-4)]">
              Rendering page {progress.page} of {progress.total}…
            </p>
          )}

          {/* Done notice */}
          {done && !error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
              ✓ Compressed PDF downloaded
              {resultSize !== null && (
                <>
                  {" "}
                  — {formatBytes(resultSize)}
                  {resultSize < file.size
                    ? ` (${Math.round((1 - resultSize / file.size) * 100)}% smaller)`
                    : " (already highly optimized — try a higher compression level)"}
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={compress} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Compress PDF
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
