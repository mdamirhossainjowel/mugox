"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { Download, Upload, X, GripVertical, AlertCircle, Check, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";
import { generateId } from "@/lib/utils/generateId";

interface PdfFile { id: string; file: File }

export default function MergePdfTool() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid: PdfFile[] = [];
    let hadError = false;
    Array.from(incoming).forEach((f) => {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        valid.push({ id: generateId(), file: f });
      } else {
        hadError = true;
      }
    });
    if (hadError) setError("Some files were skipped — only PDF files are accepted.");
    else setError(null);
    setFiles((prev) => [...prev, ...valid].slice(0, 20));
    setDone(false);
    if (valid.length) track(EVENTS.TOOL_STARTED, { tool: "merge-pdf", count: valid.length });
  }, []);

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // Drag-to-reorder
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

  const merge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setError(null);
    setDone(false);
    try {
      // Real structural merge: parse each PDF's page tree with pdf-lib and
      // copy the actual page objects into a fresh document — this preserves
      // text, fonts, links, and image quality (unlike a byte-level concat,
      // which produces a corrupt file because a PDF is not a flat stream).
      const mergedPdf = await PDFDocument.create();

      for (const { file, id } of files) {
        let bytes: ArrayBuffer;
        try {
          bytes = await file.arrayBuffer();
        } catch {
          throw new Error(`Could not read "${file.name}".`);
        }

        let srcDoc;
        try {
          srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        } catch {
          throw new Error(`"${file.name}" is not a valid or is a password-protected PDF.`);
        }

        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        void id;
      }

      const mergedBytes = await mergedPdf.save();
      const blob = bytesToBlob(mergedBytes, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "merge-pdf", files: files.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const totalSize = files.reduce((s, f) => s + f.file.size, 0);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          const inp = document.createElement("input");
          inp.type = "file";
          inp.accept = "application/pdf,.pdf";
          inp.multiple = true;
          inp.onchange = (e) => addFiles((e.target as HTMLInputElement).files);
          inp.click();
        }}
        className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-[var(--mg-border-2)] cursor-pointer hover:border-[var(--mg-brand)] hover:bg-[var(--mg-bg-1)] transition-all duration-[180ms]"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
        aria-label="Add PDF files"
      >
        <Upload className="w-6 h-6 text-[var(--mg-ink-4)]" />
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[var(--mg-ink)]">Add PDF files</p>
          <p className="text-[12px] text-[var(--mg-ink-3)]">Click or drag — up to 20 files</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] text-[var(--mg-ink-4)]">
            {files.length} file{files.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} total · Drag to reorder
          </p>
          {files.map((f, i) => (
            <div
              key={f.id}
              draggable
              onDragStart={() => onDragStart(f.id)}
              onDragOver={(e) => onDragOver(e, f.id)}
              onDrop={() => onDrop2(f.id)}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-[var(--mg-bg)] transition-all duration-[100ms] ${
                dragOverId === f.id
                  ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
                  : "border-[var(--mg-border)]"
              } ${draggingId === f.id ? "opacity-40" : ""}`}
            >
              <GripVertical className="w-4 h-4 text-[var(--mg-ink-4)] cursor-grab shrink-0" />
              <span className="text-[12px] font-medium text-[var(--mg-ink-4)] w-5 shrink-0 tabular-nums">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--mg-ink)] truncate">{f.file.name}</p>
                <p className="text-[11px] text-[var(--mg-ink-4)]">{formatBytes(f.file.size)}</p>
              </div>
              <button
                onClick={() => remove(f.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--mg-ink-4)] hover:text-[var(--mg-danger)] hover:bg-[var(--mg-danger-bg)] transition-colors shrink-0"
                aria-label={`Remove ${f.file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
          <Check className="w-4 h-4" /> Merged PDF downloaded!
        </div>
      )}

      {files.length >= 2 && (
        <Button variant="primary" onClick={merge} loading={processing}>
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Merge {files.length} PDFs & download
        </Button>
      )}

      {files.length === 1 && (
        <p className="text-[13px] text-[var(--mg-ink-4)]">Add at least one more PDF to merge.</p>
      )}
    </div>
  );
}
