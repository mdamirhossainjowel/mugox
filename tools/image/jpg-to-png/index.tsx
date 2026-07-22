"use client";

import { useState, useCallback } from "react";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import {
  RotateCcw,
  Loader2,
  AlertCircle,
  Download,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024;

export default function JpgToPngTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    const valid =
      f.type === "image/jpeg" ||
      f.type === "image/jpg" ||
      f.name.toLowerCase().endsWith(".jpg") ||
      f.name.toLowerCase().endsWith(".jpeg");

    if (!valid) {
      setError("Please upload a JPG/JPEG image.");
      return;
    }

    setFile(f);
    setDone(false);
    setError(null);

    track(EVENTS.TOOL_STARTED, {
      tool: "jpg-to-png",
    });
  }, []);

  const convert = async () => {
    if (!file) return;

    setProcessing(true);
    setDone(false);
    setError(null);

    try {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setError("Canvas is not supported.");
          setProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Conversion failed.");
              setProcessing(false);
              return;
            }

            downloadFile(
              blob,
              file.name.replace(/\.(jpg|jpeg)$/i, ".png")
            );

            setDone(true);
            setProcessing(false);

            track(EVENTS.TOOL_DOWNLOADED, {
              tool: "jpg-to-png",
            });
          },
          "image/png",
          1
        );
      };

      img.onerror = () => {
        setError("Couldn't read this image.");
        setProcessing(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error(err);
      setError("Conversion failed.");
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          Convert JPG images to PNG instantly in your browser. No uploads. No
          quality loss.
        </span>
      </div>

      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept=".jpg,.jpeg,image/jpeg"
          maxSize={MAX}
          label="Drop your JPG image"
          hint="JPG / JPEG · up to 20MB"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate">
                {file.name}
              </p>

              <p className="text-[12px] text-[var(--mg-ink-4)]">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px]">
              ✓ PNG downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={convert}
              loading={processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}

              Convert to PNG
            </Button>

            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
              New Image
            </Button>
          </div>
        </>
      )}
    </div>
  );
}