import { models } from "./models/index.js";
import { tools } from "./tools/index.js";

/**
 * Core AI Service
 * Handles all AI related operations
 */

class AIService {
  // Helper to wrap plain string into LangChain message format
  #toMessages(prompt) {
    return [{ role: "user", content: prompt }];
  }
  /**
   * Basic AI chat
   */
  async chat(prompt, modelName = "gemini") {
    try {
      const model = models[modelName];

      if (!model) {
        throw new Error(`Model ${modelName} not found`);
      }
      const response = await model.invoke(this.#toMessages(prompt));
      return response.content;
    } catch (error) {
      console.error("AI Chat Error:", error);
      throw error;
    }
  }

  /**
   * AI Chat with Web Search
   */

  async searchAndAnswer(query) {
    try {
      const searchResults = await tools.search(query);

      const context = searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join("\n");

      const prompt = `
        You are an AI assistant.
        Use the following web results to answer the question.
        Web Results:${context}
        Question: ${query}
        Answer clearly and cite sources if possible.
        `;

      const response = await models.gemini.invoke(this.#toMessages(prompt));
      return {
        answer: response.content,
        sources: searchResults,
      };
    } catch (error) {
      console.error("Search AI Error:", error);
      throw error;
    }
  }

  /**
   * Image Generation
   */
  async generateImage(prompt) {
    try {
      const image = await tools.image(prompt);
      return {
        prompt,
        image,
      };
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }

  /**
   * Audio Transcription
   */
  async transcribeAudio(filePath) {
    try {
      const transcript = await tools.transcription(filePath);
      return { type: "audio-transcription", transcript };
    } catch (error) {
      console.error("Audio Transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  /**
   * PDF Document Summarization
   */
  async summarizeDocument(filePath) {
    try {
      const text = await tools.pdf(filePath);
      const prompt = `
      Summarize the following document clearly in bullet points: ${text}
      `;
      const response = await models.mistral.invoke(this.#toMessages(prompt));

      return {
        type: "document-summary",
        summary: response.content,
      };
    } catch (error) {
      console.error("Document summarization error:", error);
      throw error;
    }
  }

  async streamChat(prompt, modelName = "gemini", onChunk) {
    const model = models[modelName];
    if (!model) throw new Error(`Model ${modelName} not found`);
    const stream = await model.stream(this.#toMessages(prompt));

    let fullResponse = "";
    for await (const chunk of stream) {
      const text = chunk.content;
      if (text) {
        fullResponse += text;
        onChunk(text);
      }
    }
    return fullResponse;
  }
  /**
   * Smart Router
   */
  async smartQuery(query, filePath = null) {
    try {
      if (query?.toLowerCase().includes("generate image")) {
        return this.generateImage(query);
      }
      if (query?.toLowerCase().includes("search")) {
        return this.searchAndAnswer(query);
      }
      if (filePath) {
        return this.transcribeAudio(filePath);
      }
      if (query?.toLowerCase().includes("code")) {
        return this.chat(query, "llama");
      }
      return this.chat(query, "gemini");
    } catch (error) {
      console.error("Smart query error:", error);
      throw error;
    }
  }
  async streamSmartQuery(query, onChunk) {
    if (query?.toLowerCase().includes("search")) {
      // search doesn't stream, emit all at once
      const result = await this.searchAndAnswer(query);
      onChunk(result.answer);
      return { answer: result.answer, sources: result.sources };
    }
    if (query?.toLowerCase().includes("code")) {
      const full = await this.streamChat(query, "llama", onChunk);
      return { answer: full };
    }
    const full = await this.streamChat(query, "gemini", onChunk);
    return { answer: full };
  }
}

export const aiService = new AIService();
