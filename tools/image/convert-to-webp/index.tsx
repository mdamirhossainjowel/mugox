"use client";
import { useState, useRef, useCallback } from "react";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, Zap } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024;

export default function ConvertToWebpTool() {
  const [original, setOriginal] = useState<{ file: File; url: string; w: number; h: number } | null>(null);
  const [quality, setQuality] = useState(85);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ size: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = useCallback((file: File) => {
    track(EVENTS.TOOL_STARTED, { tool: "convert-to-webp" });
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setResult(null);
    };
    img.src = url;
  }, []);

  const convert = () => {
    if (!original || !canvasRef.current) return;
    setProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = original.w;
      canvas.height = original.h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResult({ size: blob.size });
          const name = original.file.name.replace(/\.[^.]+$/, "") + ".webp";
          downloadFile(blob, name);
          track(EVENTS.TOOL_DOWNLOADED, { tool: "convert-to-webp" });
          setProcessing(false);
        },
        "image/webp",
        quality / 100
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
    ? Math.round(((original.file.size - result.size) / original.file.size) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {!original ? (
        <ToolDropzone
          onFile={onFile}
          accept="image/jpeg,image/png,image/gif,image/bmp"
          maxSize={MAX}
          label="Drop an image to convert to WebP"
          hint="JPG, PNG, GIF, BMP — up to 20MB"
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
              {result && savingPct > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--mg-success-bg)] border border-[var(--mg-success)]">
                  <Zap className="w-3 h-3 text-[var(--mg-success-t)]" />
                  <p className="text-[12px] font-semibold text-[var(--mg-success-t)]">
                    {savingPct}% smaller than original · {formatBytes(result.size)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
            <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1">
              WebP Quality: {quality}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(+e.target.value)}
              className="w-full accent-[var(--mg-brand)]"
              aria-label="WebP quality"
            />
            <div className="flex justify-between text-[10px] text-[var(--mg-ink-4)] mt-0.5">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={convert} loading={processing}>
              <Download className="w-4 h-4" />
              Convert to WebP & download
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
