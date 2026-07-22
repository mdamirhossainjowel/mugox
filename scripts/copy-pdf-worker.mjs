#!/usr/bin/env node
/**
 * Copies the pdfjs-dist worker script into /public so PDF tools can set
 * GlobalWorkerOptions.workerSrc to a same-origin static file — no external
 * CDN dependency, no backend, works with static hosting on Vercel.
 * Runs automatically via "predev" / "prebuild" (see package.json).
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const DEST_DIR = join(ROOT, "public");
const DEST = join(DEST_DIR, "pdf.worker.min.mjs");

if (!existsSync(SRC)) {
  console.warn(
    "[copy-pdf-worker] pdfjs-dist worker not found — is pdfjs-dist installed? Skipping copy."
  );
  process.exit(0);
}

if (!existsSync(DEST_DIR)) mkdirSync(DEST_DIR, { recursive: true });

copyFileSync(SRC, DEST);
console.log("[copy-pdf-worker] public/pdf.worker.min.mjs synced from pdfjs-dist.");
