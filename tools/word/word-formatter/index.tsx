"use client";

import { useState, useCallback } from "react";

import {
  RotateCcw,
  Loader2,
  Download,
  AlertCircle,
  FileText,
} from "lucide-react";

import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";

import { formatBytes } from "@/lib/utils/formatBytes";
import { track, EVENTS } from "@/lib/analytics/track";

import { convertWord } from "@/lib/word";

import type {
  FormatOptions,
  Alignment,
} from "@/lib/word";

const MAX = 25 * 1024 * 1024;

const marginPresets = {
  narrow: {
    top: 720,
    right: 720,
    bottom: 720,
    left: 720,
  },

  normal: {
    top: 1440,
    right: 1440,
    bottom: 1440,
    left: 1440,
  },

  wide: {
    top: 2160,
    right: 2160,
    bottom: 2160,
    left: 2160,
  },
};

export default function WordFormatterTool() {

  const [file, setFile] =
    useState<File | null>(null);

  const [processing, setProcessing] =
    useState(false);

  const [done, setDone] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [marginPreset, setMarginPreset] =
    useState<"narrow" | "normal" | "wide">(
      "normal"
    );

  const [options, setOptions] =
    useState<FormatOptions>({

      fontFamily: "Times New Roman",

      bodySize: 12,

      heading1: 18,

      heading2: 16,

      heading3: 14,

      boldHeading: true,

      italicBody: false,

      alignment: "left",

      lineSpacing: 2,

      paragraphBefore: 0,

      paragraphAfter: 0,

      firstLineIndent: 0.5,

      pageSize: "A4",

      margin: marginPresets.normal,

      header: "",

      footer: "",

      pageNumber: true,

    });

  const updateOption = <
    K extends keyof FormatOptions
  >(
    key: K,
    value: FormatOptions[K]
  ) => {

    setOptions(prev => ({
      ...prev,
      [key]: value,
    }));

  };

  const onFile = useCallback((f: File) => {

    if (!f.name.toLowerCase().endsWith(".docx")) {

      setError("Please upload a DOCX file.");

      return;

    }

    setFile(f);

    setDone(false);

    setError(null);

    track(EVENTS.TOOL_STARTED, {
      tool: "word-formatter",
    });

  }, []);
  function reset() {

  setFile(null);

  setDone(false);

  setError(null);

  setMarginPreset("normal");

  setOptions({

    fontFamily: "Times New Roman",

    bodySize: 12,

    heading1: 18,

    heading2: 16,

    heading3: 14,

    boldHeading: true,

    italicBody: false,

    alignment: "left",

    lineSpacing: 2,

    paragraphBefore: 0,

    paragraphAfter: 0,

    firstLineIndent: 0.5,

    pageSize: "A4",

    margin: marginPresets.normal,

    header: "",

    footer: "",

    pageNumber: true,

  });

}

function changeMarginPreset(

  preset: "narrow" | "normal" | "wide"

) {

  setMarginPreset(preset);

  updateOption(

    "margin",

    marginPresets[preset]

  );

}
async function handleConvert() {

  if (!file) return;

  try {

    setProcessing(true);

    setDone(false);

    setError(null);

    const arrayBuffer = await file.arrayBuffer();

    const blob = await convertWord(
      arrayBuffer,
      options
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = file.name.replace(
      /\.docx$/i,
      "-formatted.docx"
    );

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    setDone(true);

    track(EVENTS.TOOL_DOWNLOADED, {
      tool: "word-formatter",
    });

  } catch (err) {

    console.error(err);

    setError(
      err instanceof Error
        ? err.message
        : "Formatting failed."
    );

  } finally {

    setProcessing(false);

  }

}
return (

<div className="space-y-6">

  {!file ? (

    <ToolDropzone
      onFile={onFile}
      accept=".docx"
      maxSize={MAX}
      label="Drop your Word document here"
      hint="DOCX only · up to 25MB"
    />

  ) : (

    <>
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">

  <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center">

    <FileText className="w-5 h-5 text-[var(--mg-brand-t)]"/>

  </div>

  <div className="flex-1">

    <p className="font-semibold truncate">

      {file.name}

    </p>

    <p className="text-sm text-[var(--mg-ink-4)]">

      {formatBytes(file.size)}

    </p>

  </div>

</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* Font Family */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Font Family

    </label>

    <select
      value={options.fontFamily}
      onChange={(e) =>
        updateOption("fontFamily", e.target.value)
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    >
      <option>Times New Roman</option>
      <option>Arial</option>
      <option>Calibri</option>
      <option>Cambria</option>
      <option>Georgia</option>
    </select>

  </div>

  {/* Body Size */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Body Font Size

    </label>

    <input
      type="number"
      value={options.bodySize}
      min={8}
      max={24}
      onChange={(e)=>
        updateOption(
          "bodySize",
          Number(e.target.value)
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

  {/* Heading 1 */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Heading 1 Size

    </label>

    <input
      type="number"
      value={options.heading1}
      onChange={(e)=>
        updateOption(
          "heading1",
          Number(e.target.value)
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

  {/* Heading 2 */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Heading 2 Size

    </label>

    <input
      type="number"
      value={options.heading2}
      onChange={(e)=>
        updateOption(
          "heading2",
          Number(e.target.value)
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

  {/* Heading 3 */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Heading 3 Size

    </label>

    <input
      type="number"
      value={options.heading3}
      onChange={(e)=>
        updateOption(
          "heading3",
          Number(e.target.value)
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

  {/* Line Spacing */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Line Spacing

    </label>

    <select
      value={options.lineSpacing}
      onChange={(e)=>
        updateOption(
          "lineSpacing",
          Number(e.target.value)
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    >
      <option value={1}>Single</option>
      <option value={1.15}>1.15</option>
      <option value={1.5}>1.5</option>
      <option value={2}>Double</option>
    </select>

  </div>

</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* Alignment */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Text Alignment

    </label>

    <select
      value={options.alignment}
      onChange={(e)=>
        updateOption(
          "alignment",
          e.target.value as Alignment
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    >
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="justify">Justify</option>
    </select>

  </div>

  {/* Margin */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Page Margin

    </label>

    <select
      value={marginPreset}
      onChange={(e)=>
        changeMarginPreset(
          e.target.value as
          "narrow" |
          "normal" |
          "wide"
        )
      }
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    >
      <option value="narrow">Narrow</option>
      <option value="normal">Normal</option>
      <option value="wide">Wide</option>
    </select>

  </div>

  {/* Header */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Header

    </label>

    <input
      type="text"
      value={options.header}
      onChange={(e)=>
        updateOption(
          "header",
          e.target.value
        )
      }
      placeholder="Optional header"
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

  {/* Footer */}

  <div>

    <label className="block text-sm font-medium mb-2">

      Footer

    </label>

    <input
      type="text"
      value={options.footer}
      onChange={(e)=>
        updateOption(
          "footer",
          e.target.value
        )
      }
      placeholder="Optional footer"
      className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm"
    />

  </div>

</div>

<div className="flex flex-wrap gap-6 mt-2">

  <label className="flex items-center gap-2 text-sm">

    <input
      type="checkbox"
      checked={options.pageNumber}
      onChange={(e)=>
        updateOption(
          "pageNumber",
          e.target.checked
        )
      }
    />

    Add Page Numbers

  </label>

  <label className="flex items-center gap-2 text-sm">

    <input
      type="checkbox"
      checked={options.boldHeading}
      onChange={(e)=>
        updateOption(
          "boldHeading",
          e.target.checked
        )
      }
    />

    Bold Headings

  </label>

  <label className="flex items-center gap-2 text-sm">

    <input
      type="checkbox"
      checked={options.italicBody}
      onChange={(e)=>
        updateOption(
          "italicBody",
          e.target.checked
        )
      }
    />

    Italic Body Text

  </label>

</div>

{error && (

  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">

    <AlertCircle className="w-4 h-4 shrink-0"/>

    {error}

  </div>

)}

{done && (

  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px]">

    ✓ Document formatted successfully.

  </div>

)}
<div className="flex gap-2 flex-wrap">

  <Button
    variant="primary"
    onClick={handleConvert}
    loading={processing}
  >

    {processing ? (

      <Loader2 className="w-4 h-4 animate-spin"/>

    ) : (

      <Download className="w-4 h-4"/>

    )}

    Format Document

  </Button>

  <Button
    variant="ghost"
    onClick={reset}
  >

    <RotateCcw className="w-4 h-4"/>

    New File

  </Button>

</div>
    </>

  )}

</div>

);

}