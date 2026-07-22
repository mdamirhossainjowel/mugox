/**
 * Parses a human-entered page range string like "1-3, 5, 8-10" into a
 * deduplicated, sorted list of zero-indexed page indices, validated against
 * the document's actual page count. Shared by split-pdf and delete-pdf-pages
 * so both tools accept the exact same input format.
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const indices = new Set<number>();

  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Enter at least one page or range, e.g. 1-3, 5, 8-10.");
  }

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const [, startStr, endStr] = rangeMatch;
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
      if (start > end) [start, end] = [end, start];
      if (start < 1 || end > totalPages) {
        throw new Error(`"${part}" is outside this document's ${totalPages} pages.`);
      }
      for (let p = start; p <= end; p++) indices.add(p - 1);
    } else if (singleMatch) {
      const page = parseInt(singleMatch[1], 10);
      if (page < 1 || page > totalPages) {
        throw new Error(`Page ${page} is outside this document's ${totalPages} pages.`);
      }
      indices.add(page - 1);
    } else {
      throw new Error(`"${part}" isn't a valid page or range.`);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}
