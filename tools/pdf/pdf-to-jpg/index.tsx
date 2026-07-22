"use client";
import { useState, useCallback } from "react";
import JSZip from "jszip";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, AlertCircle, Info, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { loadPdfDocument, renderPageToBlob } from "@/lib/pdf/pdfjsClient";

const MAX = 50 * 1024 * 1024;

// Scale roughly maps to DPI (scale 1 ≈ 72 DPI, matching pdfjs's default unit).
const SCALE_FOR: Record<1 | 2 | 3, number> = { 1: 1, 2: 2, 3: 3 };

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    setFile(f);
    setPreviews([]);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "pdf-to-jpg" });
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setPreviews([]);

    try {
      const pdf = await loadPdfDocument(file);
      const pageCount = pdf.numPages;
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      const ext = format === "jpeg" ? "jpg" : "png";
      const quality = 0.92;

      const blobs: Blob[] = [];
      for (let i = 1; i <= pageCount; i++) {
        setProgress({ page: i, total: pageCount });
        const blob = await renderPageToBlob(pdf, i, SCALE_FOR[scale], mimeType, quality);
        blobs.push(blob);
      }

      const previewUrls = blobs.map((b) => URL.createObjectURL(b));
      setPreviews(previewUrls);

      const baseName = file.name.replace(/\.pdf$/i, "");

      if (blobs.length === 1) {
        const a = document.createElement("a");
        a.href = previewUrls[0];
        a.download = `${baseName}.${ext}`;
        a.click();
      } else {
        // Multiple pages — bundle into a single zip so it's one download,
        // not a flurry of browser download prompts.
        const zip = new JSZip();
        for (let i = 0; i < blobs.length; i++) {
          zip.file(`${baseName}-page${i + 1}.${ext}`, blobs[i]);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = zipUrl;
        a.download = `${baseName}-pages.zip`;
        a.click();
        URL.revokeObjectURL(zipUrl);
      }

      track(EVENTS.TOOL_DOWNLOADED, { tool: "pdf-to-jpg", pages: pageCount });
    } catch {
      setError("Conversion failed. Please try another PDF.");
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const reset = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFile(null);
    setPreviews([]);
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Browser support notice */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Every page converts. Multi-page PDFs download as a single .zip of images.</span>
      </div>

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

          <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)] space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">Output format</p>
              <div className="flex gap-2">
                {(["jpeg", "png"] as const).map((f) => (
                  <Button key={f} variant={format === f ? "primary" : "secondary"} size="sm" onClick={() => setFormat(f)}>
                    {f.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">Resolution</p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((s) => (
                  <Button key={s} variant={scale === s ? "primary" : "secondary"} size="sm" onClick={() => setScale(s)}>
                    {s}× {s === 1 ? "(72 DPI)" : s === 2 ? "(144 DPI)" : "(216 DPI)"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {processing && progress && (
            <p className="text-[12px] text-[var(--mg-ink-4)]">
              Rendering page {progress.page} of {progress.total}…
            </p>
          )}

          {previews.length > 0 && (
            <div className="space-y-2">
              <p className="text-[12px] font-semibold text-[var(--mg-ink-3)]">
                Preview ({previews.length} page{previews.length !== 1 ? "s" : ""})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {previews.slice(0, 9).map((src, i) => (
                  <img key={i} src={src} alt={`Page ${i + 1}`} className="rounded-lg border border-[var(--mg-border)] w-full" />
                ))}
              </div>
              {previews.length > 9 && (
                <p className="text-[11px] text-[var(--mg-ink-4)]">+ {previews.length - 9} more page(s) in the download.</p>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={convert} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Convert & download
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
