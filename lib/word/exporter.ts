import { saveAs } from "file-saver";

export function downloadWord(
  blob: Blob,
  filename: string
) {
  saveAs(blob, filename);
}