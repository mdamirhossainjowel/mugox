"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  RotateCcw,
  Loader2,
  AlertCircle,
  Download,
  Scissors,
} from "lucide-react";

import { formatBytes } from "@/lib/utils/formatBytes";
import { bytesToBlob } from "@/lib/pdf/pdfjsClient";
import { parsePageRanges } from "@/lib/pdf/pageRanges";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 50 * 1024 * 1024;

export default function ExtractPdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const [ranges, setRanges] = useState("");

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback(async (f: File) => {
    setError(null);
    setDone(false);

    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      setFile(f);
      setPageCount(pdf.getPageCount());

      track(EVENTS.TOOL_STARTED, {
        tool: "extract-pdf-pages",
      });
    } catch {
      setError(
        "Couldn't read this PDF. It may be damaged or password protected."
      );
    }
  }, []);

  async function extractPages() {
    if (!file || pageCount === null) return;

    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const selected = parsePageRanges(ranges, pageCount);

      if (!selected.length) {
        throw new Error("Please enter at least one page.");
      }

      const bytes = await file.arrayBuffer();

      const src = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const output = await PDFDocument.create();

      const copied = await output.copyPages(src, selected);

      copied.forEach((p) => output.addPage(p));

      const outBytes = await output.save();

      const blob = bytesToBlob(
        outBytes,
        "application/pdf"
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = file.name.replace(
        /\.pdf$/i,
        "-extracted.pdf"
      );

      a.click();

      URL.revokeObjectURL(url);

      track(EVENTS.TOOL_DOWNLOADED, {
        tool: "extract-pdf-pages",
      });

      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't extract pages."
      );
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setProcessing(false);
    setDone(false);
    setError(null);
  }

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
              <Scissors className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate">
                {file.name}
              </p>

              <p className="text-[12px] text-[var(--mg-ink-4)]">
                {formatBytes(file.size)}
                {pageCount &&
                  ` · ${pageCount} page${pageCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <Input
            label="Pages to extract"
            placeholder="Example: 1,3,5-8"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            hint={`This PDF contains ${pageCount} pages.`}
          />

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px]">
              ✓ Pages extracted successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={extractPages}
              loading={processing}
              disabled={!ranges.trim()}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}

              Extract Pages
            </Button>

            <Button
              variant="ghost"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4" />
              New File
            </Button>
          </div>
        </>
      )}
    </div>
  );
}