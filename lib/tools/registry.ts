import type { ToolMeta, ToolCategory } from "@/types";
import { CATEGORIES } from "@/config/categories";

// Static registry — import all tool metas explicitly for Next.js static analysis
import compressPdf from "@/tools/pdf/compress-pdf/meta";
import mergePdf from "@/tools/pdf/merge-pdf/meta";
import pdfToJpg from "@/tools/pdf/pdf-to-jpg/meta";
import resizeImage from "@/tools/image/resize-image/meta";
import compressImage from "@/tools/image/compress-image/meta";
import convertToWebp from "@/tools/image/convert-to-webp/meta";
import wordCounter from "@/tools/text/word-counter/meta";
import characterCounter from "@/tools/text/character-counter/meta";
import caseConverter from "@/tools/text/case-converter/meta";
import jsonFormatter from "@/tools/developer/json-formatter/meta";
import base64Encoder from "@/tools/developer/base64-encoder/meta";
import percentageCalculator from "@/tools/calculator/percentage-calculator/meta";
import ageCalculator from "@/tools/calculator/age-calculator/meta";
import bmiCalculator from "@/tools/calculator/bmi-calculator/meta";
//mport backgroundImage from "@/tools/image/background-remove-image/meta";
import jpgToPng from "@/tools/image/jpg-to-png/meta";

import deletePdfPages from "@/tools/pdf/delete-pdf-pages/meta";
import imagesToPdf from "@/tools/pdf/images-to-pdf/meta";
import rotatePdf from "@/tools/pdf/rotate-pdf/meta";
import splitPdf from "@/tools/pdf/split-pdf/meta";
import wordTopdf from "@/tools/pdf/word-to-pdf/meta";
import pdftoword from "@/tools/pdf/pdf-to-word/meta";
import pdfocr from "@/tools/pdf/pdf-ocr/meta";
//import unlockpdf from "@/tools/pdf/unlockpdf/meta";
//import protectpdf from "@/tools/pdf/protectpdf/meta";

export const TOOL_REGISTRY: ToolMeta[] = [
  compressPdf,
  mergePdf,
  pdfToJpg,
  resizeImage,
  compressImage,
  convertToWebp,
  wordCounter,
  characterCounter,
  caseConverter,
  jsonFormatter,
  base64Encoder,
  percentageCalculator,
  ageCalculator,
  bmiCalculator,
  deletePdfPages,
  imagesToPdf,
  rotatePdf,
  splitPdf,
  wordTopdf,
  pdfocr,
  pdftoword,
  //unlockpdf,
  //protectpdf,
 // backgroundImage,
  jpgToPng,
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return TOOL_REGISTRY.filter((t) => t.category === category);
}

export function getFeaturedTools(limit = 6): ToolMeta[] {
  return TOOL_REGISTRY.filter((t) => t.tags.includes("featured")).slice(0, limit);
}

export function getPopularTools(limit = 8): ToolMeta[] {
  return TOOL_REGISTRY.filter((t) => t.tags.includes("popular")).slice(0, limit);
}

export function getRelatedTools(tool: ToolMeta, limit = 6): ToolMeta[] {
  const manual = tool.relatedTools
    .map((slug) => TOOL_REGISTRY.find((t) => t.slug === slug))
    .filter((t): t is ToolMeta => t !== undefined);

  const categoryTools = TOOL_REGISTRY.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug
  ).slice(0, limit - manual.length);

  return [...manual, ...categoryTools].slice(0, limit);
}

export function getCategoriesWithCount(): (ToolCategory & { toolCount: number })[] {
  return CATEGORIES.map((cat) => ({
    ...cat,
    toolCount: getToolsByCategory(cat.slug).length,
  }));
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase();
  return TOOL_REGISTRY.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  );
}
