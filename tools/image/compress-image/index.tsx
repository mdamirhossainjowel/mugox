"use client";
import { useState, useRef, useCallback } from "react";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024;

export default function CompressImageTool() {
  const [original, setOriginal] = useState<{ file: File; url: string; w: number; h: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ size: number; saved: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = useCallback((file: File) => {
    track(EVENTS.TOOL_STARTED, { tool: "compress-image" });
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setResult(null);
      // Auto-detect format
      if (file.type === "image/png") setFormat("png");
      else if (file.type === "image/webp") setFormat("webp");
      else setFormat("jpeg");
    };
    img.src = url;
  }, []);

  const compress = () => {
    if (!original || !canvasRef.current) return;
    setProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = original.w;
      canvas.height = original.h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const saved = original.file.size - blob.size;
          setResult({ size: blob.size, saved });
          const ext = format === "jpeg" ? "jpg" : format;
          const name = original.file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
          downloadFile(blob, name);
          track(EVENTS.TOOL_DOWNLOADED, { tool: "compress-image", saved_bytes: saved });
          setProcessing(false);
        },
        `image/${format}`,
        format === "png" ? undefined : quality / 100
      );
    };
    img.src = original.url;
  };

  const reset = () => {
    if (original) URL.revokeObjectURL(original.url);
    setOriginal(null);
    setResult(null);
  };

  const savingPct = result && original
    ? Math.round((result.saved / original.file.size) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {!original ? (
        <ToolDropzone
          onFile={onFile}
          accept="image/jpeg,image/png,image/webp"
          maxSize={MAX}
          label="Drop an image to compress"
          hint="JPG, PNG, WebP — up to 20MB"
        />
      ) : (
        <>
          <div className="flex gap-4 items-start flex-wrap">
            <img
              src={original.url}
              alt="Preview"
              className="w-28 h-28 object-contain rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{original.file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)] mt-0.5">
                {formatBytes(original.file.size)} · {original.w} × {original.h} px
              </p>
              {result && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--mg-success-bg)] border border-[var(--mg-success)]">
                  <p className="text-[12px] font-semibold text-[var(--mg-success-t)]">
                    Saved {formatBytes(result.saved)} ({savingPct}% smaller) · Output: {formatBytes(result.size)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">
                Output format
              </label>
              <div className="flex gap-1.5">
                {(["jpeg", "png", "webp"] as const).map((f) => (
                  <Button key={f} variant={format === f ? "primary" : "secondary"} size="sm" onClick={() => setFormat(f)}>
                    {f.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            {format !== "png" && (
              <div>
                <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1">
                  Quality: {quality}%
                  <span className="ml-2 text-[var(--mg-ink-4)] font-normal">
                    {quality >= 85 ? "High" : quality >= 65 ? "Balanced" : "Small file"}
                  </span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(+e.target.value)}
                  className="w-full accent-[var(--mg-brand)]"
                  aria-label="Compression quality"
                />
                <div className="flex justify-between text-[10px] text-[var(--mg-ink-4)] mt-0.5">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={compress} loading={processing}>
              <Download className="w-4 h-4" />
              Compress & download
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="w-3.5 h-3.5" />
              New image
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
