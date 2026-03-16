import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

//What this model will be used for: explanations, summarization,lightweight tasks
export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 1024,
});
