import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
} from "pdf-lib";

export type PageNumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface AddPageNumbersOptions {
  startNumber: number;
  fontSize: number;
  margin: number;
  color: string;
  position: PageNumberPosition;
  skipFirstPage?: boolean;
  skipLastPage?: boolean;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  const bigint = parseInt(value, 16);

  return rgb(
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255
  );
}

function getX(
  width: number,
  textWidth: number,
  margin: number,
  position: PageNumberPosition
) {
  switch (position) {
    case "top-left":
    case "bottom-left":
      return margin;

    case "top-center":
    case "bottom-center":
      return (width - textWidth) / 2;

    case "top-right":
    case "bottom-right":
      return width - textWidth - margin;
  }
}

function getY(
  height: number,
  margin: number,
  fontSize: number,
  position: PageNumberPosition
) {
  switch (position) {
    case "top-left":
    case "top-center":
    case "top-right":
      return height - margin - fontSize;

    default:
      return margin;
  }
}

export async function addPageNumbers(
  input: ArrayBuffer,
  options: AddPageNumbersOptions
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(input, {
    ignoreEncryption: true,
  });

  const font: PDFFont = await pdf.embedFont(
    StandardFonts.Helvetica
  );

  const pages = pdf.getPages();

  let number = options.startNumber;

  pages.forEach((page, index) => {
    if (options.skipFirstPage && index === 0) return;

    if (
      options.skipLastPage &&
      index === pages.length - 1
    )
      return;

    const text = String(number);

    const width = page.getWidth();

    const height = page.getHeight();

    const textWidth = font.widthOfTextAtSize(
      text,
      options.fontSize
    );

    page.drawText(text, {
      x: getX(
        width,
        textWidth,
        options.margin,
        options.position
      ),
      y: getY(
        height,
        options.margin,
        options.fontSize,
        options.position
      ),
      font,
      size: options.fontSize,
      color: hexToRgb(options.color),
    });

    number++;
  });

  return await pdf.save();
}