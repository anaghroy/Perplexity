import { tavilySearch } from "./tavily.tool.js";
import { generateImage } from "./image.tool.js";
import { transcribeAudio } from "./transcription.tool.js";
import { extractPdfText } from "./document.tool.js";

export const tools = {
  search: tavilySearch,
  image: generateImage,
  transcription: transcribeAudio,
  pdf: extractPdfText,
};
