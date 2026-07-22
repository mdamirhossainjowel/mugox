"use client";
import { useState, useCallback, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Loader2, AlertCircle, Download, Info, FileText } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";
import { loadPdfDocument, renderPageToBlob } from "@/lib/pdf/pdfjsClient";

const MAX = 30 * 1024 * 1024;

export default function PdfOcrTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageTexts, setPageTexts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const onFile = useCallback((f: File) => {
    setFile(f);
    setPageTexts(null);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "pdf-ocr" });
  }, []);

  const runOcr = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setPageTexts(null);
    cancelRef.current = false;

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

    try {
      setStatus("Loading OCR engine…");
      worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setStatus(`Reading text… ${Math.round(m.progress * 100)}%`);
          } else {
            setStatus(m.status);
          }
        },
      });

      const pdf = await loadPdfDocument(file);
      const results: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelRef.current) break;
        setStatus(`Rendering page ${i} of ${pdf.numPages}…`);
        // PNG (lossless) at 2x scale — better OCR accuracy than JPEG artifacts.
        const blob = await renderPageToBlob(pdf, i, 2, "image/png", 1);
        const { data } = await worker.recognize(blob);
        results.push(data.text.trim());
      }

      setPageTexts(results);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "pdf-ocr", pages: results.length });
    } catch {
      setError("OCR failed. Try a smaller file, or a PDF with clearer scanned pages.");
    } finally {
      if (worker) await worker.terminate();
      setProcessing(false);
      setStatus("");
    }
  };

  const downloadTxt = () => {
    if (!pageTexts || !file) return;
    const text = pageTexts.map((t, i) => `--- Page ${i + 1} ---\n${t}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, "-ocr.txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDocx = async () => {
    if (!pageTexts || !file) return;
    const children: Paragraph[] = [];
    pageTexts.forEach((text, i) => {
      if (i > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
      const lines = text.split("\n").filter((l) => l.trim() !== "");
      if (lines.length === 0) children.push(new Paragraph({ text: "" }));
      lines.forEach((line) => children.push(new Paragraph({ children: [new TextRun(line)] })));
    });
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, "-ocr.docx");
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPageTexts(null);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          For scanned/image-only PDFs. The first run downloads a language model (a few MB), then
          each page takes a few seconds — larger PDFs take longer.
        </span>
      </div>

      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept="application/pdf,.pdf"
          maxSize={MAX}
          label="Drop your scanned PDF here"
          hint="PDF only · up to 30MB"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[var(--mg-brand-t)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--mg-ink)] truncate">{file.name}</p>
              <p className="text-[12px] text-[var(--mg-ink-4)]">{formatBytes(file.size)}</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {processing && status && (
            <p className="text-[12px] text-[var(--mg-ink-4)]">{status}</p>
          )}

          {pageTexts && !error && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
                ✓ Text extracted from {pageTexts.length} page{pageTexts.length !== 1 ? "s" : ""}.
              </div>
              <div className="max-h-64 overflow-y-auto p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
                <pre className="text-[12px] font-mono text-[var(--mg-ink-2)] whitespace-pre-wrap">
                  {pageTexts.join("\n\n---\n\n") || "(No text detected on any page.)"}
                </pre>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary" onClick={downloadTxt}>
                  <Download className="w-3.5 h-3.5" /> Download .txt
                </Button>
                <Button variant="secondary" onClick={downloadDocx}>
                  <Download className="w-3.5 h-3.5" /> Download .docx
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={runOcr} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Run OCR
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
