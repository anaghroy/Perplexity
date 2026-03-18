import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { aiService } from "../services/ai.service.js";
import { getIO, waitForRoom } from "../sockets/server.socket.js";

//POST /api/chat - creates or continues a chat
export async function sendMessageController(req, res) {
  try {
    const { query, chatId } = req.body;
    const userId = req.user.id;
    const io = getIO();

    /**Create a new chat or use existing one */
    let chat;
    if (chatId) {
      chat = await chatModel.findOne({ _id: chatId, user: userId });
      if (!chat)
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });

      // Save user follow-up message
      await messageModel.create({
        chat: chat._id,
        content: query,
        role: "user",
      });
      res.status(200).json({
        success: true,
        chatId: chat._id,
      });
    } else {
      const title = await aiService.generateChatTitle(query);
      chat = await chatModel.create({
        user: userId,
        title,
      });
      await messageModel.create({
        chat: chat._id,
        content: query,
        role: "user",
      });
      // Respond immediately with chatId so frontend can listen on the right socket room
      res.status(200).json({
        success: true,
        chatId: chat._id,
      });
    }
    await waitForRoom(chat._id);
    //Join socket room for this chat and stream AI response
    const socketRoom = `chat:${chat._id}`;

    const result = await aiService.streamSmartQuery(query, (chunk) => {
      io.to(socketRoom).emit("ai:chunk", { chunk });
    });

    //Save complete AI response to DB
    await messageModel.create({
      chat: chat._id,
      content: result.answer,
      role: "ai",
    });
    // Emit done event with sources if any
    io.to(socketRoom).emit("ai:done", {
      sources: result.sources || null,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    const io = getIO();
    if (req.body.chatId) {
      io.to(`chat:${req.body.chatId}`).emit("ai:error", {
        message: error.message,
      });
    }
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

//GET /api/chat - get all chats for the logged in user
export async function getChatsController(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select("title updatedAt");

    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/chat/:chatId/messages — get all messages in a chat
export async function getChatMessagesController(req, res) {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await chatModel.findOne({ _id: chatId, user: userId });
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// DELETE /api/chat/:chatId — delete a chat and its messages
export async function deleteChatController(req, res) {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: userId,
    });
    if (!chat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });

    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
