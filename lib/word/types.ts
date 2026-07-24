export type Alignment =
  | "left"
  | "center"
  | "right"
  | "justify";

export interface MarginPreset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FormatOptions {
  fontFamily: string;

  bodySize: number;

  heading1: number;
  heading2: number;
  heading3: number;

  boldHeading: boolean;

  italicBody: boolean;

  alignment: Alignment;

  lineSpacing: number;

  paragraphBefore: number;

  paragraphAfter: number;

  firstLineIndent: number;

  pageSize: "A4" | "LETTER" | "LEGAL";

  margin: MarginPreset;

  header: string;

  footer: string;

  pageNumber: boolean;
}