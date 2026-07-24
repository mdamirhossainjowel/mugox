import { parseWordFile } from "./parser";
import { buildFormattedWord } from "./formatter";
import type { FormatOptions } from "./types";

export async function convertWord(
  arrayBuffer: ArrayBuffer,
  options: FormatOptions
): Promise<Blob> {

  const blocks = await parseWordFile(arrayBuffer);

  return await buildFormattedWord(blocks, options);

}