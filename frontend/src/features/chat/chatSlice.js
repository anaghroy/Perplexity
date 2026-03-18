import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMessageAPI,
  getChatsAPI,
  getChatMessagesAPI,
  deleteChatAPI,
} from "./chatAPI";
import socket from "../../services/socket";

// Thunks
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ query, chatId }, { rejectWithValue }) => {
    try {
      const data = await sendMessageAPI({ query, chatId });
      console.log("Joining room:", data.chatId);
      // Join socket room after getting chatId
      socket.emit("join:chat", data.chatId);
      return data; // { chatId }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message",
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
    chats: [], // sidebar thread list
    activeChatId: null, // currently open chat
    messages: [], // messages for active chat
    streamingText: "", // live AI response being streamed
    isStreaming: false, // true while AI is responding
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
      state.streamingText += action.payload; // 👈 called on every ai:chunk
    },
    streamingDone: (state, action) => {
      // Move streamed text into messages array as AI message
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
      });
    },
  },
  extraReducers: (builder) => {
    // sendMessage
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.isStreaming = true;
        state.streamingText = "";
        // Optimistically add user message
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

    // fetchChats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
      })
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
