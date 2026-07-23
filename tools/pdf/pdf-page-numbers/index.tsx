"use client";

import { useState, useCallback } from "react";

import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";

import {
  RotateCcw,
  Loader2,
  AlertCircle,
  Download,
  Hash,
} from "lucide-react";

import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";

import { track, EVENTS } from "@/lib/analytics/track";

import {
  addPageNumbers,
  type PageNumberPosition,
} from "@/lib/pdf/addPageNumbers";

const MAX = 50 * 1024 * 1024;

const positions: {
  value: PageNumberPosition;
  label: string;
}[] = [
  {
    value: "top-left",
    label: "Top Left",
  },
  {
    value: "top-center",
    label: "Top Center",
  },
  {
    value: "top-right",
    label: "Top Right",
  },
  {
    value: "bottom-left",
    label: "Bottom Left",
  },
  {
    value: "bottom-center",
    label: "Bottom Center",
  },
  {
    value: "bottom-right",
    label: "Bottom Right",
  },
];

export default function PdfPageNumbersTool() {

  const [file, setFile] = useState<File | null>(null);

  const [processing, setProcessing] = useState(false);

  const [done, setDone] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [startNumber, setStartNumber] = useState(1);

  const [fontSize, setFontSize] = useState(14);

  const [margin, setMargin] = useState(25);

  const [color, setColor] = useState("#000000");

  const [position, setPosition] =
    useState<PageNumberPosition>("bottom-center");

  const [skipFirst, setSkipFirst] = useState(false);

  const [skipLast, setSkipLast] = useState(false);

  const onFile = useCallback((f: File) => {

    if (
      !f.name.toLowerCase().endsWith(".pdf") &&
      f.type !== "application/pdf"
    ) {
      setError("Please upload a PDF file.");
      return;
    }

    setFile(f);

    setDone(false);

    setError(null);

    track(EVENTS.TOOL_STARTED, {
      tool: "pdf-page-numbers",
    });

  }, []);

  async function processPdf() {

    if (!file) return;

    setProcessing(true);

    setDone(false);

    setError(null);

    try {

      const bytes = await file.arrayBuffer();

      const output = await addPageNumbers(bytes, {

        startNumber,

        fontSize,

        margin,

        color,

        position,

        skipFirstPage: skipFirst,

        skipLastPage: skipLast,

      });

     const safeOutput = new Uint8Array(output);

downloadFile(
  new Blob([safeOutput], { type: "application/pdf" }),
  file.name.replace(/\.pdf$/i, "-numbered.pdf")
);

      track(EVENTS.TOOL_DOWNLOADED, {

        tool: "pdf-page-numbers",

      });

      setDone(true);

    } catch (err) {

      console.error(err);

      setError("Failed to add page numbers.");

    } finally {

      setProcessing(false);

    }

  }

  function reset() {

    setFile(null);

    setDone(false);

    setError(null);

    setStartNumber(1);

    setFontSize(14);

    setMargin(25);

    setColor("#000000");

    setPosition("bottom-center");

    setSkipFirst(false);

    setSkipLast(false);

  }

  return (

    <div className="space-y-5">

      {!file ? (

        <ToolDropzone

          onFile={onFile}

          accept=".pdf,application/pdf"

          maxSize={MAX}

          label="Drop your PDF here"

          hint="PDF only · up to 50MB"

        />

      ) : (
<>
             <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">

            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5 text-[var(--mg-brand-t)]" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium mb-2">
                Start Number
              </label>

              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) =>
                  setStartNumber(Number(e.target.value))
                }
                className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Font Size
              </label>

              <input
                type="number"
                min={8}
                max={72}
                value={fontSize}
                onChange={(e) =>
                  setFontSize(Number(e.target.value))
                }
                className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Margin
              </label>

              <input
                type="number"
                min={0}
                max={100}
                value={margin}
                onChange={(e) =>
                  setMargin(Number(e.target.value))
                }
                className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Number Color
              </label>

              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-[var(--mg-border)]"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Position
            </label>

            <select
              value={position}
              onChange={(e) =>
                setPosition(
                  e.target.value as PageNumberPosition
                )
              }
              className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
            >
              {positions.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

          </div>

          <div className="flex flex-wrap gap-6">

            <label className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                checked={skipFirst}
                onChange={(e) =>
                  setSkipFirst(e.target.checked)
                }
              />

              Skip First Page

            </label>

            <label className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                checked={skipLast}
                onChange={(e) =>
                  setSkipLast(e.target.checked)
                }
              />

              Skip Last Page

            </label>

          </div>
                    {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px]">
              ✓ Page numbers added successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">

            <Button
              variant="primary"
              onClick={processPdf}
              loading={processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}

              Add Page Numbers
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