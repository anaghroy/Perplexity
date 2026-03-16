import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF file
 */

export async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract PDF text");
  }
}
