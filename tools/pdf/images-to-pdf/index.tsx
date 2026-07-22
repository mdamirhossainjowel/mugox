"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { Download, Upload, X, GripVertical, AlertCircle, Check, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";
import { generateId } from "@/lib/utils/generateId";

interface ImgFile { id: string; file: File; previewUrl: string }

const MAX_EACH = 20 * 1024 * 1024;

function isSupportedImage(f: File) {
  const type = f.type.toLowerCase();
  const name = f.name.toLowerCase();
  return (
    type === "image/jpeg" ||
    type === "image/png" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png")
  );
}

export default function ImagesToPdfTool() {
  const [files, setFiles] = useState<ImgFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid: ImgFile[] = [];
    let hadError = false;
    Array.from(incoming).forEach((f) => {
      if (isSupportedImage(f) && f.size <= MAX_EACH) {
        valid.push({ id: generateId(), file: f, previewUrl: URL.createObjectURL(f) });
      } else {
        hadError = true;
      }
    });
    if (hadError) setError("Some files were skipped — only JPG/PNG images up to 20MB are accepted.");
    else setError(null);
    setFiles((prev) => [...prev, ...valid].slice(0, 40));
    setDone(false);
    if (valid.length) track(EVENTS.TOOL_STARTED, { tool: "images-to-pdf", count: valid.length });
  }, []);

  const remove = (id: string) =>
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const onDragStart = (id: string) => setDraggingId(id);
  const onDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id); };
  const onDrop2 = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    setFiles((prev) => {
      const arr = [...prev];
      const fromIdx = arr.findIndex((f) => f.id === draggingId);
      const toIdx = arr.findIndex((f) => f.id === targetId);
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
    setDraggingId(null);
    setDragOverId(null);
  };
  const onDragEnd = () => { setDraggingId(null); setDragOverId(null); };

  const convert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const doc = await PDFDocument.create();

      for (const { file } of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const outBytes = await doc.save();
      const blob = bytesToBlob(outBytes, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "images-to-pdf", files: files.length });
    } catch {
      setError("Couldn't build the PDF — try removing any unusual or corrupted images.");
    } finally {
      setProcessing(false);
    }
  };

  const totalSize = files.reduce((s, f) => s + f.file.size, 0);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          const inp = document.createElement("input");
          inp.type = "file";
          inp.accept = "image/jpeg,image/png,.jpg,.jpeg,.png";
          inp.multiple = true;
          inp.onchange = (e) => addFiles((e.target as HTMLInputElement).files);
          inp.click();
        }}
        className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-[var(--mg-border-2)] cursor-pointer hover:border-[var(--mg-brand)] hover:bg-[var(--mg-bg-1)] transition-all duration-[180ms]"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
        aria-label="Add images"
      >
        <Upload className="w-6 h-6 text-[var(--mg-ink-4)]" />
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[var(--mg-ink)]">Add JPG or PNG images</p>
          <p className="text-[12px] text-[var(--mg-ink-3)]">Click or drag — up to 40 images</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] text-[var(--mg-ink-4)]">
            {files.length} image{files.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} total · Drag to reorder
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {files.map((f, i) => (
              <div
                key={f.id}
                draggable
                onDragStart={() => onDragStart(f.id)}
                onDragOver={(e) => onDragOver(e, f.id)}
                onDrop={() => onDrop2(f.id)}
                onDragEnd={onDragEnd}
                className={`relative rounded-xl border overflow-hidden bg-[var(--mg-bg)] transition-all duration-[100ms] ${
                  dragOverId === f.id
                    ? "border-[var(--mg-brand)]"
                    : "border-[var(--mg-border)]"
                } ${draggingId === f.id ? "opacity-40" : ""}`}
              >
                <img src={f.previewUrl} alt={f.file.name} className="w-full h-24 object-cover" />
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[var(--mg-bg-1)]">
                  <GripVertical className="w-3.5 h-3.5 text-[var(--mg-ink-4)] cursor-grab shrink-0" />
                  <span className="text-[11px] font-medium text-[var(--mg-ink-4)] tabular-nums shrink-0">{i + 1}</span>
                  <p className="text-[11px] text-[var(--mg-ink)] truncate flex-1 min-w-0">{f.file.name}</p>
                  <button
                    onClick={() => remove(f.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--mg-ink-4)] hover:text-[var(--mg-danger)] hover:bg-[var(--mg-danger-bg)] transition-colors shrink-0"
                    aria-label={`Remove ${f.file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
          <Check className="w-4 h-4" /> PDF downloaded!
        </div>
      )}

      {files.length > 0 && (
        <Button variant="primary" onClick={convert} loading={processing}>
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Create PDF from {files.length} image{files.length !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}
