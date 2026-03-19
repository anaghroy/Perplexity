import { aiService } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

/**
 * AI chat / Smart Query
 */
export async function smartQueryController(req, res) {
  try {
    const { query } = req.body;
    const result = await aiService.smartQuery(query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("AI Query Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Image Generation
 * - Creates a new chat if chatId is not provided (new thread)
 * - Saves both user prompt + AI image messages to DB
 * - Returns chatId so the frontend can set activeChatId
 */
export async function generateImageController(req, res) {
  try {
    const { prompt, chatId } = req.body;
    const userId = req.user.id;

    // ── Create chat if this is a new thread ───────────────────────────────
    let resolvedChatId = chatId;
    if (!resolvedChatId) {
      const title = await aiService.generateChatTitle(prompt);
      const newChat = await chatModel.create({ user: userId, title });
      resolvedChatId = newChat._id;
    }

    // ── Generate image and upload to ImageKit ─────────────────────────────
    const result = await aiService.generateImage(prompt);

    // ── Save user prompt message ──────────────────────────────────────────
    await messageModel.create({
      chat: resolvedChatId,
      role: "user",
      content: `Generate an image: ${prompt}`,
      type: "text",
    });

    // ── Save AI image message ─────────────────────────────────────────────
    await messageModel.create({
      chat: resolvedChatId,
      role: "ai",
      content: result.url,
      type: "image",
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        prompt,
        chatId: resolvedChatId,   // ← returned so frontend sets activeChatId
      },
    });
  } catch (error) {
    console.error("Image Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Audio Transcription
 */
export async function transcribeAudioController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file uploaded" });
    }
    const result = await aiService.transcribeAudio(req.file.path);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Audio Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Document Summarization
 */
export async function summarizeDocumentController(req, res) {
  try {
    const result = await aiService.summarizeDocument(req.file.path);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Document Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}