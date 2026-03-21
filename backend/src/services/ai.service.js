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
  async generateChatTitle(query) {
    try {
      const prompt = `Generate a very short title (2-4 words) for a chat that starts with this message: "${query}". Reply with ONLY the title, no punctuation, no quotes.`;
      const response = await models.gemini.invoke(this.#toMessages(prompt));
      return response.content.trim();
    } catch (error) {
      return query.slice(0, 30);
    }
  }

  /**
   * AI Chat with Web Search
   */
  async searchAndAnswer(query) {
    const searchResults = await tools.search(query);

    if (!searchResults || searchResults.length === 0) {
      return {
        answer:
          "I couldn't find any relevant web results for that query. Try rephrasing or ask me directly.",
        sources: [],
      };
    }

    const context = searchResults
      .map(
        (r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nSummary: ${r.content}`,
      )
      .join("\n\n");

    const prompt = `You are a helpful AI assistant with access to live web search results.

Use ONLY the web results below to answer the question.
Cite sources inline using [1], [2], etc. matching the result numbers.
If the results don't contain enough information, say so clearly — do not make things up.

Web Results:
${context}

Question: ${query}

Answer:`;

    const response = await models.gemini.invoke(this.#toMessages(prompt));

    return {
      answer: response.content,
      sources: searchResults.map((r) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    };
  }

  /**
   * Image Generation
   */
  async generateImage(prompt) {
    try {
      const result = await tools.image(prompt);
      return {
        type: "image-generation",
        prompt: result.prompt,
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      };
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }

  /**
   * Audio Transcription
   */
  async transcribeAudio(buffer, originalname, mimetype) {
    try {
      const transcript = await tools.transcription(buffer, originalname, mimetype);
      return { type: "audio-transcription", transcript };
    } catch (error) {
      console.error("Audio Transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  /**
   * PDF Document Summarization
   */
  async summarizeDocument(buffer) {
    try {
      const text = await tools.pdf(buffer);
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
