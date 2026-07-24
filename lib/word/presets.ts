import { FormatOptions } from "./types";

export const MarginPresets = {
  Narrow: {
    top: 720,
    right: 720,
    bottom: 720,
    left: 720,
  },

  Normal: {
    top: 1440,
    right: 1440,
    bottom: 1440,
    left: 1440,
  },

  Moderate: {
    top: 1800,
    right: 1800,
    bottom: 1800,
    left: 1800,
  },

  Wide: {
    top: 2160,
    right: 2160,
    bottom: 2160,
    left: 2160,
  },
};

export const DefaultFormat: FormatOptions = {
  fontFamily: "Times New Roman",

  bodySize: 12,

  heading1: 18,

  heading2: 16,

  heading3: 14,

  boldHeading: true,

  italicBody: false,

  alignment: "justify",

  lineSpacing: 1.5,

  paragraphBefore: 0,

  paragraphAfter: 8,

  firstLineIndent: 0.5,

  pageSize: "A4",

  margin: MarginPresets.Normal,

  header: "",

  footer: "",

  pageNumber: true,
};