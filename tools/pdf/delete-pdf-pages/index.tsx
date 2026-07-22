"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RotateCcw, Loader2, AlertCircle, Download } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";
import { parsePageRanges } from "@/lib/pdf/pageRanges";

const MAX = 50 * 1024 * 1024;

export default function DeletePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback(async (f: File) => {
    setError(null);
    setDone(false);
    setFile(f);
    setPageCount(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      track(EVENTS.TOOL_STARTED, { tool: "delete-pdf-pages" });
    } catch {
      setError("Couldn't read this PDF — it may be corrupted or password-protected.");
      setFile(null);
    }
  }, []);

  const removePages = async () => {
    if (!file || pageCount === null) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const toRemove = parsePageRanges(ranges, pageCount);
      if (toRemove.length >= pageCount) {
        throw new Error("At least one page must remain — you can't remove every page.");
      }

      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Remove highest indices first so earlier indices don't shift.
      const sortedDesc = [...toRemove].sort((a, b) => b - a);
      for (const index of sortedDesc) doc.removePage(index);

      const outBytes = await doc.save();
      const blob = bytesToBlob(outBytes, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "-edited.pdf");
      a.click();
      URL.revokeObjectURL(url);

      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "delete-pdf-pages", removed: toRemove.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't remove those pages. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setDone(false);
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)]">
                {formatBytes(file.size)}
                {pageCount !== null && ` · ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {pageCount !== null && (
            <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)]">
              <Input
                label="Pages to delete"
                placeholder="e.g. 2, 4, 6-8"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                hint={`This document has ${pageCount} page${pageCount !== 1 ? "s" : ""}.`}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {done && !error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
              ✓ Edited PDF downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={removePages} loading={processing} disabled={ranges.trim() === ""}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Delete pages
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
