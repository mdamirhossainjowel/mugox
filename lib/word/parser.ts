import mammoth from "mammoth";

export type ParsedBlock =
  | {
      type: "heading";
      level: 1 | 2 | 3;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      ordered: boolean;
      items: string[];
    }
  | {
      type: "table";
      rows: string[][];
    }
  | {
      type: "image";
      src: string;
    };

export async function parseWordFile(
  arrayBuffer: ArrayBuffer
): Promise<ParsedBlock[]> {
  const result = await mammoth.convertToHtml({
    arrayBuffer,
  });

  const html = result.value;

  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  const blocks: ParsedBlock[] = [];

  Array.from(doc.body.children).forEach((node) => {
    const tag = node.tagName.toLowerCase();

    //----------------------------------------------------
    // Heading
    //----------------------------------------------------

    if (
      tag === "h1" ||
      tag === "h2" ||
      tag === "h3"
    ) {
      blocks.push({
        type: "heading",
        level: Number(tag[1]) as 1 | 2 | 3,
        text: node.textContent?.trim() ?? "",
      });

      return;
    }

    //----------------------------------------------------
    // Paragraph
    //----------------------------------------------------

    if (tag === "p") {
      const text = node.textContent?.trim() ?? "";

      if (text.length) {
        blocks.push({
          type: "paragraph",
          text,
        });
      }

      return;
    }

    //----------------------------------------------------
    // UL
    //----------------------------------------------------

    if (tag === "ul") {
      const items = Array.from(
        node.querySelectorAll("li")
      ).map((li) => li.textContent?.trim() ?? "");

      blocks.push({
        type: "list",
        ordered: false,
        items,
      });

      return;
    }

    //----------------------------------------------------
    // OL
    //----------------------------------------------------

    if (tag === "ol") {
      const items = Array.from(
        node.querySelectorAll("li")
      ).map((li) => li.textContent?.trim() ?? "");

      blocks.push({
        type: "list",
        ordered: true,
        items,
      });

      return;
    }

    //----------------------------------------------------
    // TABLE
    //----------------------------------------------------

    if (tag === "table") {
      const rows: string[][] = [];

      node.querySelectorAll("tr").forEach((tr) => {
        const row: string[] = [];

        tr.querySelectorAll("td,th").forEach((cell) => {
          row.push(
            cell.textContent?.trim() ?? ""
          );
        });

        rows.push(row);
      });

      blocks.push({
        type: "table",
        rows,
      });

      return;
    }

    //----------------------------------------------------
    // IMAGE
    //----------------------------------------------------

    if (tag === "img") {
      const src =
        node.getAttribute("src") ?? "";

      blocks.push({
        type: "image",
        src,
      });

      return;
    }
  });

  return blocks;
}