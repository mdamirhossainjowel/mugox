"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RotateCcw, Loader2, AlertCircle, Download, Info } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";
import { parsePageRanges } from "@/lib/pdf/pageRanges";

const MAX = 50 * 1024 * 1024;

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [everyPage, setEveryPage] = useState(false);
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
      track(EVENTS.TOOL_STARTED, { tool: "split-pdf" });
    } catch {
      setError("Couldn't read this PDF — it may be corrupted or password-protected.");
      setFile(null);
    }
  }, []);

  const split = async () => {
    if (!file || pageCount === null) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const baseName = file.name.replace(/\.pdf$/i, "");

      // Build the list of page-index groups to extract.
      let groups: number[][];
      if (everyPage) {
        groups = Array.from({ length: pageCount }, (_, i) => [i]);
      } else {
        const indices = parsePageRanges(ranges, pageCount);
        groups = [indices];
      }

      const outputs: { name: string; bytes: Uint8Array }[] = [];
      for (let g = 0; g < groups.length; g++) {
        const outDoc = await PDFDocument.create();
        const copied = await outDoc.copyPages(srcDoc, groups[g]);
        copied.forEach((p) => outDoc.addPage(p));
        const outBytes = await outDoc.save();
        const label = everyPage ? `page-${groups[g][0] + 1}` : "extracted";
        outputs.push({ name: `${baseName}-${label}.pdf`, bytes: outBytes });
      }

      if (outputs.length === 1) {
        const blob = bytesToBlob(outputs[0].bytes, "application/pdf");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = outputs[0].name;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const zip = new JSZip();
        outputs.forEach((o) => zip.file(o.name, o.bytes));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${baseName}-split.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "split-pdf", outputs: outputs.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Split failed. Please check your page ranges.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setEveryPage(false);
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
            <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)] space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setEveryPage(false)}
                  className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-medium border transition-all duration-[180ms] ${
                    !everyPage
                      ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]"
                      : "border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
                  }`}
                >
                  Custom range
                </button>
                <button
                  onClick={() => setEveryPage(true)}
                  className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-medium border transition-all duration-[180ms] ${
                    everyPage
                      ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]"
                      : "border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
                  }`}
                >
                  Split every page
                </button>
              </div>

              {!everyPage && (
                <Input
                  label="Pages to extract"
                  placeholder="e.g. 1-3, 5, 8-10"
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  hint={`This document has ${pageCount} page${pageCount !== 1 ? "s" : ""}.`}
                />
              )}
            </div>
          )}

          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Extracted pages keep full original quality — text stays selectable.</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {done && !error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
              ✓ Split PDF downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={split}
              loading={processing}
              disabled={!everyPage && ranges.trim() === ""}
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Split PDF
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
