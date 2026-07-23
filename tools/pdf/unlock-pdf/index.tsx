"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolDropzone } from "@/components/tools/ToolDropzone";
import { Button } from "@/components/ui/Button";
import {
  RotateCcw,
  Loader2,
  AlertCircle,
  Download,
  LockOpen,
  Info,
} from "lucide-react";
import { formatBytes } from "@/lib/utils/formatBytes";
import { downloadFile } from "@/lib/utils/downloadFile";
import { track, EVENTS } from "@/lib/analytics/track";

const MAX = 50 * 1024 * 1024;

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      tool: "unlock-pdf",
    });
  }, []);

  const unlock = async () => {
    if (!file) return;

    setProcessing(true);
    setDone(false);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        password,
      });

      pdf.setTitle(pdf.getTitle() || "");

      const output = await pdf.save();

      downloadFile(
        new Blob([output], {
          type: "application/pdf",
        }),
        file.name.replace(/\.pdf$/i, "-unlocked.pdf")
      );

      setDone(true);

      track(EVENTS.TOOL_DOWNLOADED, {
        tool: "unlock-pdf",
      });
    } catch (err) {
      console.error(err);

      setError(
        "Incorrect password or this PDF cannot be unlocked."
      );
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPassword("");
    setDone(false);
    setError(null);
  };

  return (
    <div className="space-y-5">

      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)] text-[12px]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          Unlock password-protected PDF files securely inside your browser.
          Your password and files never leave your device.
        </span>
      </div>

      {!file ? (
        <ToolDropzone
          onFile={onFile}
          accept=".pdf,application/pdf"
          maxSize={MAX}
          label="Drop your protected PDF"
          hint="PDF only · up to 50MB"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--mg-bg-1)] border border-[var(--mg-border)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--mg-brand-bg)] flex items-center justify-center shrink-0">
              <LockOpen className="w-5 h-5 text-[var(--mg-brand-t)]" />
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

          <input
            type="password"
            placeholder="Enter PDF password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 text-sm outline-none"
          />

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--mg-success-bg)] text-[var(--mg-success-t)] text-[13px]">
              ✓ PDF unlocked successfully.
            </div>
          )}

          <div className="flex gap-2 flex-wrap">

            <Button
              variant="primary"
              onClick={unlock}
              loading={processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}

              Unlock PDF
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