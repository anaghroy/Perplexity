import { geminiModel } from "./gemini.model.js";
import { llamaModel } from "./llama.model.js";
import { mistralModel } from "./mistral.model.js";

export const models = {
  gemini: geminiModel,
  llama: llamaModel,
  mistral: mistralModel,
};
