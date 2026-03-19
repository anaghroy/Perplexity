import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMessageAPI,
  getChatsAPI,
  getChatMessagesAPI,
  deleteChatAPI,
} from "./chatAPI";
import { generateImageAPI } from "../ai/aiAPI";
import socket from "../../services/socket";

// Thunks
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ query, chatId }, { rejectWithValue }) => {
    try {
      const data = await sendMessageAPI({ query, chatId });
      socket.emit("join:chat", data.chatId);
      return data; // { chatId }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

/**
 * generateImage thunk
 * Handles the full image flow for both new and existing chats:
 *  1. Calls the backend which creates a chat (if chatId is null) and saves the message
 *  2. Returns { chatId, imageUrl } so the slice can update activeChatId + messages
 */
export const generateImage = createAsyncThunk(
  "chat/generateImage",
  async ({ prompt, chatId }, { rejectWithValue }) => {
    try {
      const res = await generateImageAPI(prompt, chatId);
      // Backend returns { success, data: { url, chatId, fileId, name, prompt } }
      const { url, chatId: returnedChatId } = res.data;
      if (!url) throw new Error("No image URL returned");
      socket.emit("join:chat", returnedChatId);
      return { imageUrl: url, chatId: returnedChatId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate image",
      );
    }
  },
);

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getChatsAPI();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats",
      );
    }
  },
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const data = await getChatMessagesAPI(chatId);
      return { chatId, messages: data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      await deleteChatAPI(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chat",
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null,
    messages: [],
    streamingText: "",
    isStreaming: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
      state.messages = [];
      state.streamingText = "";
    },
    appendChunk: (state, action) => {
      state.streamingText += action.payload;
    },
    streamingDone: (state, action) => {
      state.messages.push({
        _id: Date.now().toString(),
        role: "ai",
        content: state.streamingText,
        sources: action.payload?.sources || null,
      });
      state.streamingText = "";
      state.isStreaming = false;
    },
    clearChat: (state) => {
      state.activeChatId = null;
      state.messages = [];
      state.streamingText = "";
      state.isStreaming = false;
    },
    injectMessage: (state, action) => {
      state.messages.push({
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        role: action.payload.role,
        content: action.payload.content,
        sources: action.payload.sources || null,
        type: action.payload.type || "text",   // ← FIX: preserve type field
      });
    },
  },
  extraReducers: (builder) => {
    // sendMessage
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.isStreaming = true;
        state.streamingText = "";
        state.messages.push({
          _id: Date.now().toString(),
          role: "user",
          content: action.meta.arg.query,
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeChatId = action.payload.chatId;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isStreaming = false;
        state.error = action.payload;
      });

    // generateImage
    builder
      .addCase(generateImage.pending, (state, action) => {
        // Optimistically add the user prompt message immediately
        state.messages.push({
          _id: Date.now().toString(),
          role: "user",
          content: `Generate an image: ${action.meta.arg.prompt}`,
        });
        state.isLoading = true;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Set activeChatId — critical for new threads where it was null
        state.activeChatId = action.payload.chatId;
        // Add the AI image message
        state.messages.push({
          _id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          role: "ai",
          content: action.payload.imageUrl,
          type: "image",
        });
        // Add new chat to sidebar if it isn't there yet
        // (the chat list will refresh on next loadChats, but this avoids
        //  a blank sidebar after generating on a brand new thread)
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          _id: Date.now().toString(),
          role: "ai",
          content: `**Error generating image**: ${action.payload}`,
        });
      });

    // fetchChats
    builder
      .addCase(fetchChats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // fetchChatMessages
    builder.addCase(fetchChatMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
    });

    // deleteChat
    builder.addCase(deleteChat.fulfilled, (state, action) => {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
      if (state.activeChatId === action.payload) {
        state.activeChatId = null;
        state.messages = [];
      }
    });
  },
});

export const { setActiveChatId, appendChunk, streamingDone, clearChat, injectMessage } =
  chatSlice.actions;
export default chatSlice.reducer;