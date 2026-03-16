import { ChatGroq } from "@langchain/groq";

//What this model will be used for: complex reasoning, coding, research
export const llamaModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
  maxTokens: 1024,
});
