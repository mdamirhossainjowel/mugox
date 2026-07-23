// tools/image/remove-background/index.tsx
"use client";
import { useState, useRef, useCallback } from "react";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, Eye, EyeOff, Wand2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 15 * 1024 * 1024;

const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-conic-gradient(var(--mg-bg-2) 0% 25%, var(--mg-bg) 0% 50%)",
  backgroundSize: "16px 16px",
};

interface OriginalImage {
  file: File;
  url: string;
  w: number;
  h: number;
}

export default function RemoveBackgroundTool() {
  const [original, setOriginal] = useState<OriginalImage | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const onFile = useCallback((file: File) => {
    track(EVENTS.TOOL_STARTED, { tool: "remove-background" });
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    const img = new window.Image();
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setResultUrl(null);
      setResultSize(null);
      setError(null);
      setShowOriginal(false);
    };
    img.src = url;
  }, []);

  const removeBackground = async () => {
    if (!original) return;
    setProcessing(true);
    setProgress(0);
    setProgressLabel("Loading on-device model…");
    setError(null);

    try {
      const { removeBackground: runRemoval } = await import("@imgly/background-removal");
      const blob = await runRemoval(original.file, {
        progress: (key: string, current: number, total: number) => {
          setProgressLabel(
            key.toLowerCase().includes("fetch") ? "Downloading model…" : "Processing image…"
          );
          setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
        },
      });
      const url = URL.createObjectURL(blob);
      objectUrlsRef.current.push(url);
      setResultUrl(url);
      setResultSize(blob.size);
      track(EVENTS.TOOL_COMPLETED, { tool: "remove-background" });
    } catch (err) {
      console.error(err);
      setError("Couldn't process this image. Try a smaller file or a different photo.");
      track(EVENTS.TOOL_FAILED, { tool: "remove-background" });
    } finally {
      setProcessing(false);
    }
  };

  const download = async () => {
    if (!resultUrl || !original) return;
    const blob = await fetch(resultUrl).then((r) => r.blob());
    const name = original.file.name.replace(/\.[^.]+$/, "") + "-no-bg.png";
    downloadFile(blob, name);
    track(EVENTS.TOOL_DOWNLOADED, { tool: "remove-background" });
  };

  const reset = () => {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = [];
    setOriginal(null);
    setResultUrl(null);
    setResultSize(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {!original ? (
        <ToolDropzone
          onFile={onFile}
          accept="image/jpeg,image/png,image/webp"
          maxSize={MAX}
          label="Drop a photo to remove its background"
          hint="JPG, PNG, WebP — up to 15MB"
        />
      ) : (
        <>
          <div className="rounded-xl border border-[var(--mg-border)] overflow-hidden">
            <div
              className="relative flex items-center justify-center min-h-[220px] max-h-[420px] p-4"
              style={resultUrl && !showOriginal ? CHECKERBOARD_STYLE : undefined}
            >
              <img
                src={showOriginal || !resultUrl ? original.url : resultUrl}
                alt={showOriginal || !resultUrl ? "Original" : "Background removed"}
                className="max-h-[380px] max-w-full object-contain rounded-lg"
              />
              {resultUrl && (
                <button
                  onClick={() => setShowOriginal((s) => !s)}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-[var(--mg-bg)]/90 backdrop-blur border border-[var(--mg-border-2)] text-[var(--mg-ink-2)] hover:bg-[var(--mg-bg-1)] transition-colors duration-[180ms]"
                >
                  {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showOriginal ? "Show result" : "Show original"}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[var(--mg-bg-1)] border-t border-[var(--mg-border)]">
              <p className="text-[12px] text-[var(--mg-ink-4)] truncate">
                {original.file.name} · {original.w} × {original.h} px · {formatBytes(original.file.size)}
              </p>
              {resultSize !== null && (
                <p className="text-[12px] font-semibold text-[var(--mg-success-t)] shrink-0">
                  Output: {formatBytes(resultSize)}
                </p>
              )}
            </div>
          </div>

          {processing && (
            <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-[var(--mg-ink-2)]">{progressLabel}</p>
                <p className="text-[12px] text-[var(--mg-ink-4)]">{progress}%</p>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--mg-bg-2)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--mg-brand)] transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--mg-ink-4)] mt-2">
                First run downloads a small on-device model (cached after that) — your photo itself never leaves your browser.
              </p>
            </div>
          )}

          {error && <p className="text-[13px] text-[var(--mg-danger)]">{error}</p>}

          <div className="flex gap-2 flex-wrap">
            {!resultUrl ? (
              <Button variant="primary" onClick={removeBackground} loading={processing}>
                <Wand2 className="w-4 h-4" />
                Remove background
              </Button>
            ) : (
              <Button variant="primary" onClick={download}>
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
            )}
            <Button variant="ghost" onClick={reset} disabled={processing}>
              <RotateCcw className="w-3.5 h-3.5" />
              New image
            </Button>
          </div>
        </>
      )}
    </div>
  );
}