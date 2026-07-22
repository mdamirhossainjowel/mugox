"use client";
import { useState, useCallback } from "react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Loader2, AlertCircle, Download, Info } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024;

type Run = { text: string; bold: boolean };
type Block =
  | { type: "heading"; level: 1 | 2 | 3; runs: Run[] }
  | { type: "paragraph"; runs: Run[] }
  | { type: "list-item"; ordered: boolean; runs: Run[] };

interface RawLine {
  text: string;
  fontSize: number;
  bold: boolean;
  gapBefore: number;
  newPage: boolean;
}

const BULLET_RE = /^[-•*\u2022]\s+/;
const NUMBERED_RE = /^\d+[.)]\s+/;
type PdfTextItem = { str: string; transform: number[]; fontName?: string };

/**
 * Extracts text lines from every page of a PDF using pdf.js, grouping text
 * items into visual lines by y-position. This reproduces the document's
 * *content* — headings, paragraphs, and lists — not its exact pixel layout.
 */
async function extractLines(file: File): Promise<RawLine[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const lines: RawLine[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    type Item = { text: string; fontSize: number; bold: boolean; y: number };
    const rows = new Map<number, Item[]>();

    for (const raw of content.items as unknown[]) {
      const item = raw as Partial<PdfTextItem>;
      if (!item.str || !item.transform) continue;
      const transform = item.transform;
      const fontSize = Math.abs(transform[3]) || Math.abs(transform[0]) || 12;
      const bold = /bold/i.test(item.fontName || "");
      const y = Math.round(transform[5] / 3) * 3;
      const arr = rows.get(y) || [];
      arr.push({ text: item.str, fontSize, bold, y });
      rows.set(y, arr);
    }

    const sortedYs = Array.from(rows.keys()).sort((a, b) => b - a);
    let prevY: number | null = null;

    sortedYs.forEach((y, idx) => {
      const items = rows.get(y)!;
      const text = items.map((i) => i.text).join("").replace(/[ \t]+/g, " ").trim();
      const fontSize = Math.max(...items.map((i) => i.fontSize));
      const bold = items.length > 0 && items.every((i) => i.bold);
      const gapBefore = prevY === null ? 0 : prevY - y;
      if (text) {
        lines.push({ text, fontSize, bold, gapBefore, newPage: idx === 0 && p > 1 });
      }
      prevY = y;
    });
  }

  return lines;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function buildBlocks(lines: RawLine[]): Block[] {
  if (lines.length === 0) return [];

  const bodyFontSize = median(lines.map((l) => l.fontSize)) || 12;
  const lineGap = median(lines.filter((l) => l.gapBefore > 0).map((l) => l.gapBefore)) || bodyFontSize * 1.2;
  const paragraphBreakThreshold = lineGap * 1.6;

  const blocks: Block[] = [];
  let current: Run[] | null = null;

  const flush = () => {
    if (current && current.length > 0) {
      blocks.push({ type: "paragraph", runs: current });
    }
    current = null;
  };

  for (const line of lines) {
    const isHeading = line.fontSize >= bodyFontSize * 1.25 && line.text.length < 90;
    const isBullet = BULLET_RE.test(line.text);
    const isNumbered = NUMBERED_RE.test(line.text);

    if (isHeading) {
      flush();
      const ratio = line.fontSize / bodyFontSize;
      const level: 1 | 2 | 3 = ratio >= 1.7 ? 1 : ratio >= 1.45 ? 2 : 3;
      blocks.push({ type: "heading", level, runs: [{ text: line.text, bold: true }] });
      continue;
    }

    if (isBullet || isNumbered) {
      flush();
      const cleaned = line.text.replace(BULLET_RE, "").replace(NUMBERED_RE, "");
      blocks.push({ type: "list-item", ordered: isNumbered, runs: [{ text: cleaned, bold: line.bold }] });
      continue;
    }

    const isNewParagraph = line.newPage || line.gapBefore > paragraphBreakThreshold || current === null;
    if (isNewParagraph) {
      flush();
      current = [{ text: line.text, bold: line.bold }];
    } else {
      current!.push({ text: " " + line.text, bold: line.bold });
    }
  }
  flush();

  return blocks;
}

function blocksToDocx(blocks: Block[]): Document {
  const children = blocks.map((block) => {
    if (block.type === "heading") {
      const headingLevel = block.level === 1 ? HeadingLevel.HEADING_1 : block.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
      return new Paragraph({
        heading: headingLevel,
        spacing: { before: 240, after: 120 },
        children: block.runs.map((r) => new TextRun({ text: r.text, bold: true })),
      });
    }
    if (block.type === "list-item") {
      return new Paragraph({
        bullet: block.ordered ? undefined : { level: 0 },
        spacing: { after: 100 },
        children: block.runs.map((r) => new TextRun({ text: (block.ordered ? "• " : "") + r.text, bold: r.bold })),
      });
    }
    return new Paragraph({
      spacing: { after: 160 },
      children: block.runs.map((r) => new TextRun({ text: r.text, bold: r.bold })),
    });
  });

  return new Document({
    sections: [{ properties: {}, children }],
  });
}

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setDone(false);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "pdf-to-word" });
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const lines = await extractLines(file);
      if (lines.length === 0) {
        throw new Error("Couldn't find any readable text in this PDF — it may be a scanned or image-only document.");
      }

      const blocks = buildBlocks(lines);
      const doc = blocksToDocx(blocks);
      const blob = await Packer.toBlob(doc);

      downloadFile(blob, file.name.replace(/\.pdf$/i, ".docx"));
      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "pdf-to-word" });
    } catch (err) {
      console.error("pdf-to-word conversion failed:", err);
      setError(err instanceof Error ? err.message : "Couldn't convert this PDF. Please try another file.");
    } finally {
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
          Best for text-based PDFs — headings, paragraphs, and lists convert into an editable Word
          document. Scanned pages, images, and complex tables aren&apos;t extracted.
        </span>
      </div>

      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept=".pdf,application/pdf"
          maxSize={MAX}
          label="Drop your PDF here"
          hint="PDF only · up to 20MB"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[var(--mg-brand-t)]" />
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

          {done && !error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px] font-medium">
              ✓ Word document downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={convert} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Convert to Word
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