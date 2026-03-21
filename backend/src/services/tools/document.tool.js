import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF file
 */

export async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);

    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract PDF text");
  }
}
