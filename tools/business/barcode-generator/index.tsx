"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import {
  Download,
  RotateCcw,
  Barcode,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { downloadFile } from "@/lib/utils/downloadFile";

import { track, EVENTS } from "@/lib/analytics/track";

export default function BarcodeGeneratorTool() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [value, setValue] = useState("1234567890");

  const [format, setFormat] = useState("CODE128");

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      JsBarcode(svgRef.current, value || " ", {
        format,
        displayValue: true,
        lineColor: "#000",
        width: 2,
        height: 80,
        margin: 10,
      });

      track(EVENTS.TOOL_STARTED, {
        tool: "barcode-generator",
      });

    } catch {}
  }, [value, format]);

  const downloadSvg = () => {
    if (!svgRef.current) return;

    const serializer = new XMLSerializer();

    const source = serializer.serializeToString(svgRef.current);

    downloadFile(
      new Blob([source], {
        type: "image/svg+xml",
      }),
      "barcode.svg"
    );

    track(EVENTS.TOOL_DOWNLOADED, {
      tool: "barcode-generator",
    });
  };

  const reset = () => {
    setValue("");

    setFormat("CODE128");
  };

  return (
    <div className="space-y-6">

      <div>

        <label className="text-sm font-semibold">

          Barcode Text

        </label>

        <input
          className="mt-2 w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter barcode text"
        />

      </div>

      <div>

        <label className="text-sm font-semibold">

          Barcode Format

        </label>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3"
        >
          <option value="CODE128">Code 128</option>
          <option value="CODE39">Code 39</option>
          <option value="EAN13">EAN-13</option>
          <option value="EAN8">EAN-8</option>
          <option value="UPC">UPC</option>
          <option value="ITF14">ITF-14</option>
          <option value="MSI">MSI</option>
          <option value="pharmacode">Pharmacode</option>
        </select>

      </div>

      <div className="rounded-2xl border border-[var(--mg-border)] bg-white p-8 flex justify-center">

        <svg ref={svgRef}></svg>

      </div>

      <div className="flex flex-wrap gap-3">

        <Button
          variant="primary"
          onClick={downloadSvg}
        >

          <Download className="w-4 h-4" />

          Download SVG

        </Button>

        <Button
          variant="ghost"
          onClick={reset}
        >

          <RotateCcw className="w-4 h-4" />

          Reset

        </Button>

      </div>

    </div>
  );
}