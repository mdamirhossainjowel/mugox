"use client";

/**
 * Wraps a Uint8Array as a Blob. Exists because newer TS DOM lib typings make
 * Blob's constructor stricter about ArrayBufferView<ArrayBuffer> than the
 * Uint8Array<ArrayBufferLike> that libraries like pdf-lib return — this is a
 * type-level mismatch only, safe at runtime, and slicing guarantees an exact
 * ArrayBuffer regardless of the source view's offset/length.
 */
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Blob([buffer], { type });
}

/**
 * Lazily loads pdfjs-dist and points it at the self-hosted worker in /public
 * (synced by scripts/copy-pdf-worker.mjs on every dev/build run).
 * Must only be called in the browser — pdfjs-dist needs DOM/canvas.
 */
export async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjsLib;
}

/** Loads a File into a pdfjs PDFDocumentProxy. */
export async function loadPdfDocument(file: File) {
  const pdfjsLib = await getPdfjs();
  const buf = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buf });
  return loadingTask.promise;
}

/**
 * Renders one page of a pdfjs document onto an offscreen canvas and returns
 * a JPEG/PNG blob. `scale` maps roughly to DPI (scale 1 ≈ 72 DPI).
 */
export async function renderPageToBlob(
  pdf: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number,
  scale: number,
  mimeType: "image/jpeg" | "image/png",
  quality: number
): Promise<Blob> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // JPEG has no alpha channel — paint a white background first.
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      mimeType,
      quality
    );
  });
}
