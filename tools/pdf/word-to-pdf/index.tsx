"use client";
import { useState, useCallback } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Loader2, AlertCircle, Download, Info } from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 20 * 1024 * 1024;

// A4 page geometry in points (jsPDF default unit here is "pt").
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const MAX_Y = PAGE_HEIGHT - MARGIN;

type Run = { text: string; bold: boolean; italic: boolean };
type Block =
  | { type: "heading"; level: 1 | 2 | 3; runs: Run[] }
  | { type: "paragraph"; runs: Run[] }
  | { type: "list-item"; ordered: boolean; index: number; runs: Run[] }
  | { type: "image"; src: string }
  | { type: "table"; rows: string[][] }
  | { type: "space" };

/**
 * Walk a DOM node collecting text runs with bold/italic state.
 * This intentionally ignores font colors, alignment, and other rich
 * styling — the goal is faithful *text* reproduction, not pixel parity.
 */
function collectRuns(node: Node, bold: boolean, italic: boolean, runs: Run[]) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || "";
      if (text.trim().length > 0 || text.includes(" ")) {
        runs.push({ text, bold, italic });
      }
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const nextBold = bold || tag === "strong" || tag === "b";
    const nextItalic = italic || tag === "em" || tag === "i";
    if (tag === "br") {
      runs.push({ text: "\n", bold, italic });
      return;
    }
    collectRuns(el, nextBold, nextItalic, runs);
  });
}

function parseHtmlToBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: Block[] = [];
  let listCounter = 0;

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1" || tag === "h2" || tag === "h3") {
      const runs: Run[] = [];
      collectRuns(el, true, false, runs);
      blocks.push({ type: "heading", level: Number(tag[1]) as 1 | 2 | 3, runs });
      return;
    }

    if (tag === "p") {
      const runs: Run[] = [];
      collectRuns(el, false, false, runs);
      if (runs.length === 0) {
        blocks.push({ type: "space" });
      } else {
        blocks.push({ type: "paragraph", runs });
      }
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const ordered = tag === "ol";
      listCounter = 0;
      el.querySelectorAll(":scope > li").forEach((li) => {
        listCounter += 1;
        const runs: Run[] = [];
        collectRuns(li, false, false, runs);
        blocks.push({ type: "list-item", ordered, index: listCounter, runs });
      });
      return;
    }

    if (tag === "img") {
      const src = el.getAttribute("src");
      if (src) blocks.push({ type: "image", src });
      return;
    }

    if (tag === "table") {
      const rows: string[][] = [];
      el.querySelectorAll("tr").forEach((tr) => {
        const cells: string[] = [];
        tr.querySelectorAll("td, th").forEach((cell) => {
          cells.push((cell.textContent || "").trim());
        });
        if (cells.length) rows.push(cells);
      });
      if (rows.length) blocks.push({ type: "table", rows });
      return;
    }

    // Fallback: treat unknown block-level tags as plain paragraphs so
    // content is never silently dropped.
    const runs: Run[] = [];
    collectRuns(el, false, false, runs);
    if (runs.length > 0) blocks.push({ type: "paragraph", runs });
  });

  return blocks;
}

function setFont(pdf: jsPDF, bold: boolean, italic: boolean) {
  const style = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
  pdf.setFont("times", style);
}

/** Word-wraps a run array within CONTENT_WIDTH, writing lines to the PDF and
 *  advancing/paginating the y-cursor as needed. Returns the updated y. */
function renderRuns(
  pdf: jsPDF,
  runs: Run[],
  startX: number,
  startY: number,
  fontSize: number,
  lineHeight: number
): number {
  let x = startX;
  let y = startY;
  const rightEdge = PAGE_WIDTH - MARGIN;

  const ensureRoom = () => {
    if (y > MAX_Y) {
      pdf.addPage();
      y = MARGIN;
      x = startX;
    }
  };

  pdf.setFontSize(fontSize);

  runs.forEach((run) => {
    const segments = run.text.split("\n");
    segments.forEach((segment, i) => {
      if (i > 0) {
        y += lineHeight;
        x = startX;
        ensureRoom();
      }
      const words = segment.split(/(\s+)/).filter((w) => w.length > 0);
      words.forEach((word) => {
        setFont(pdf, run.bold, run.italic);
        const width = pdf.getTextWidth(word);
        if (x + width > rightEdge && word.trim().length > 0) {
          y += lineHeight;
          x = startX;
          ensureRoom();
        }
        if (word.trim().length > 0) {
          pdf.text(word, x, y);
        }
        x += width;
      });
    });
  });

  return y + lineHeight;
}

async function loadImageDimensions(src: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a .docx file (older .doc files aren't supported).");
      return;
    }
    setFile(f);
    setDone(false);
    setError(null);
    track(EVENTS.TOOL_STARTED, { tool: "word-to-pdf" });
  }, []);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDone(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (!result.value.trim()) {
        throw new Error("This document appears to be empty — nothing to convert.");
      }

      const blocks = parseHtmlToBlocks(result.value);
      if (blocks.length === 0) {
        throw new Error("Couldn't find any readable text in this document.");
      }

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      let y = MARGIN;

      const ensureRoom = (needed = 0) => {
        if (y + needed > MAX_Y) {
          pdf.addPage();
          y = MARGIN;
        }
      };

      for (const block of blocks) {
        if (block.type === "space") {
          y += 8;
          continue;
        }

        if (block.type === "heading") {
          const size = block.level === 1 ? 20 : block.level === 2 ? 16 : 13;
          ensureRoom(size);
          y = renderRuns(pdf, block.runs, MARGIN, y, size, size * 1.25);
          y += 6;
          continue;
        }

        if (block.type === "paragraph") {
          ensureRoom(12);
          y = renderRuns(pdf, block.runs, MARGIN, y, 11, 14);
          y += 6;
          continue;
        }

        if (block.type === "list-item") {
          ensureRoom(12);
          const bullet = block.ordered ? `${block.index}.` : "•";
          pdf.setFont("times", "normal");
          pdf.setFontSize(11);
          pdf.text(bullet, MARGIN, y);
          y = renderRuns(pdf, block.runs, MARGIN + 16, y, 11, 14);
          continue;
        }

        if (block.type === "table") {
          pdf.setFont("times", "normal");
          pdf.setFontSize(10);
          for (const row of block.rows) {
            ensureRoom(12);
            const line = row.join("   |   ");
            const wrapped = pdf.splitTextToSize(line, CONTENT_WIDTH);
            wrapped.forEach((wLine: string) => {
              ensureRoom(12);
              pdf.text(wLine, MARGIN, y);
              y += 13;
            });
          }
          y += 8;
          continue;
        }

        if (block.type === "image") {
          const dims = await loadImageDimensions(block.src);
          if (!dims) continue;
          const scale = Math.min(1, CONTENT_WIDTH / dims.width);
          const w = dims.width * scale;
          const h = dims.height * scale;
          ensureRoom(h);
          try {
            pdf.addImage(block.src, "JPEG", MARGIN, y, w, h);
          } catch {
            // Some encodings (e.g. non-JPEG/PNG data URIs) can fail here;
            // skip the image rather than aborting the whole document.
          }
          y += h + 10;
          continue;
        }
      }

      pdf.save(file.name.replace(/\.docx$/i, ".pdf"));
      setDone(true);
      track(EVENTS.TOOL_DOWNLOADED, { tool: "word-to-pdf" });
    } catch (err) {
      console.error("word-to-pdf conversion failed:", err);
      setError(err instanceof Error ? err.message : "Couldn't convert this document. Please try another file.");
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
          Best for text, headings, lists, and simple tables. Text is generated natively, so it stays
          selectable and searchable in the output PDF. Complex layouts, exact fonts, and column layouts
          from the original Word file aren&apos;t preserved pixel-for-pixel.
        </span>
      </div>

      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          maxSize={MAX}
          label="Drop your Word document here"
          hint=".docx only · up to 20MB"
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
              ✓ PDF downloaded successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={convert} loading={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Convert to PDF
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
