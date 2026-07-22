"use client";
import { useState, useRef, useCallback } from "react";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Download, RotateCcw, Link2, Link2Off } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024; // 20MB

export default function ResizeImageTool() {
  const [original, setOriginal] = useState<{ file: File; url: string; w: number; h: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = useCallback((file: File) => {
    track(EVENTS.TOOL_STARTED, { tool: "resize-image" });
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  }, []);

  const handleWidthChange = (v: string) => {
    setWidth(v);
    if (locked && original && +v > 0) {
      setHeight(String(Math.round((+v / original.w) * original.h)));
    }
  };

  const handleHeightChange = (v: string) => {
    setHeight(v);
    if (locked && original && +v > 0) {
      setWidth(String(Math.round((+v / original.h) * original.w)));
    }
  };

  const resize = () => {
    if (!original || !canvasRef.current) return;
    setProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const w = Math.max(1, +width || original.w);
      const h = Math.max(1, +height || original.h);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const ext = format === "jpeg" ? "jpg" : format;
          const name = original.file.name.replace(/\.[^.]+$/, "") + `-${w}x${h}.${ext}`;
          downloadFile(blob, name);
          track(EVENTS.TOOL_DOWNLOADED, { tool: "resize-image", width: w, height: h });
          setProcessing(false);
        },
        `image/${format}`,
        quality / 100
      );
    };
    img.src = original.url;
  };

  const reset = () => {
    if (original) URL.revokeObjectURL(original.url);
    setOriginal(null);
    setWidth("");
    setHeight("");
  };

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {!original ? (
        <ToolDropzone
          onFile={onFile}
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
          maxSize={MAX}
          label="Drop an image here"
          hint="JPG, PNG, WebP, GIF, BMP — up to 20MB"
        />
      ) : (
        <>
          {/* Preview */}
          <div className="flex gap-4 items-start flex-wrap">
            <img
              src={original.url}
              alt="Original"
              className="w-28 h-28 object-contain rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{original.file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)] mt-0.5">
                {formatBytes(original.file.size)} · {original.w} × {original.h} px
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
            <div className="flex items-end gap-2">
              <Input
                id="rw"
                label="Width (px)"
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                min={1}
              />
              <button
                onClick={() => setLocked(!locked)}
                className="mb-0.5 p-2 rounded-lg border border-[var(--mg-border-2)] bg-[var(--mg-bg)] text-[var(--mg-ink-4)] hover:text-[var(--mg-ink-2)] hover:bg-[var(--mg-bg-2)] transition-colors shrink-0"
                aria-label={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
                title={locked ? "Aspect ratio locked" : "Aspect ratio unlocked"}
              >
                {locked ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
              </button>
              <Input
                id="rh"
                label="Height (px)"
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                min={1}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1">
                  Output format
                </label>
                <div className="flex gap-1.5">
                  {(["jpeg", "png", "webp"] as const).map((f) => (
                    <Button
                      key={f}
                      variant={format === f ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setFormat(f)}
                    >
                      {f.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              {format !== "png" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(+e.target.value)}
                    className="w-full accent-[var(--mg-brand)]"
                    aria-label="Output quality"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={resize} loading={processing}>
              <Download className="w-4 h-4" />
              Download resized image
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
