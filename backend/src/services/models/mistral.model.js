import { ChatMistralAI } from "@langchain/mistralai";

//What this model will be used for: creative writing, content generation, brainstorming
export const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0.7,
  maxTokens: 1024,
});
