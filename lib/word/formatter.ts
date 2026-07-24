import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ImageRun,
} from "docx";

import { ParsedBlock } from "./parser";
import { FormatOptions } from "./types";

function mapAlignment(alignment: string) {
  switch (alignment) {
    case "center":
      return AlignmentType.CENTER;

    case "right":
      return AlignmentType.RIGHT;

    case "justify":
      return AlignmentType.JUSTIFIED;

    default:
      return AlignmentType.LEFT;
  }
}

function headingLevel(level: number) {
  switch (level) {
    case 1:
      return HeadingLevel.HEADING_1;

    case 2:
      return HeadingLevel.HEADING_2;

    default:
      return HeadingLevel.HEADING_3;
  }
}

export async function buildFormattedWord(
  blocks: ParsedBlock[],
  options: FormatOptions
) {
  const children: (
    | Paragraph
    | Table
  )[] = [];

  for (const block of blocks) {
    //--------------------------------------------------
    // Heading
    //--------------------------------------------------

    if (block.type === "heading") {
      const size =
        block.level === 1
          ? options.heading1
          : block.level === 2
          ? options.heading2
          : options.heading3;

      children.push(
        new Paragraph({
          heading: headingLevel(block.level),

          alignment: mapAlignment(
            options.alignment
          ),

          spacing: {
            before:
              options.paragraphBefore * 20,

            after:
              options.paragraphAfter * 20,

            line:
              options.lineSpacing * 240,
          },

          children: [
            new TextRun({
              text: block.text,

              bold: options.boldHeading,

              font: options.fontFamily,

              size: size * 2,
            }),
          ],
        })
      );

      continue;
    }

    //--------------------------------------------------
    // Paragraph
    //--------------------------------------------------

    if (block.type === "paragraph") {
      children.push(
        new Paragraph({
          alignment: mapAlignment(
            options.alignment
          ),

          indent: {
            firstLine:
              options.firstLineIndent * 720,
          },

          spacing: {
            before:
              options.paragraphBefore * 20,

            after:
              options.paragraphAfter * 20,

            line:
              options.lineSpacing * 240,
          },

          children: [
            new TextRun({
              text: block.text,

              font: options.fontFamily,

              italics:
                options.italicBody,

              size:
                options.bodySize * 2,
            }),
          ],
        })
      );

      continue;
    }

    //--------------------------------------------------
    // List
    //--------------------------------------------------

    if (block.type === "list") {
      block.items.forEach((item, index) => {
        children.push(
          new Paragraph({
            numbering: {
              reference: block.ordered
                ? "ordered-list"
                : "bullet-list",

              level: 0,
            },

            children: [
              new TextRun({
                text: item,

                font:
                  options.fontFamily,

                size:
                  options.bodySize * 2,
              }),
            ],
          })
        );
      });

      continue;
    }

    //--------------------------------------------------
    // Table
    //--------------------------------------------------

    if (block.type === "table") {
      children.push(
        new Table({
          rows: block.rows.map(
            (row) =>
              new TableRow({
                children: row.map(
                  (cell) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: cell,

                              font:
                                options.fontFamily,

                              size:
                                options.bodySize *
                                2,
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              })
          ),
        })
      );

      continue;
    }

    //--------------------------------------------------
    // Image
    //--------------------------------------------------

    if (block.type === "image") {
      continue;
  }

  //----------------------------------------------------
  // Document
  //----------------------------------------------------

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullet-list",

          levels: [
            {
              level: 0,

              format: "bullet",

              text: "•",

              alignment:
                AlignmentType.LEFT,
            },
          ],
        },

        {
          reference: "ordered-list",

          levels: [
            {
              level: 0,

              format: "decimal",

              text: "%1.",

              alignment:
                AlignmentType.LEFT,
            },
          ],
        },
      ],
    },

    sections: [
      {
        properties: {
          page: {
            margin: options.margin,
          },
        },

        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment:
                  AlignmentType.CENTER,

                children: [
                  new TextRun({
                    text:
                      options.header,
                  }),
                ],
              }),
            ],
          }),
        },

        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment:
                  AlignmentType.CENTER,

                children: [
                  new TextRun({
                    text:
                      options.footer,
                  }),

                  ...(options.pageNumber
                    ? [
                        new TextRun(
                          "   "
                        ),

                        PageNumber.CURRENT,
                      ]
                    : []),
                ],
              }),
            ],
          }),
        },

        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}