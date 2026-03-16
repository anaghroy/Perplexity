export const selectChats = (state) => state.chat.chats;
export const selectActiveChatId = (state) => state.chat.activeChatId;
export const selectMessages = (state) => state.chat.messages;
export const selectStreamingText = (state) => state.chat.streamingText;
export const selectIsStreaming = (state) => state.chat.isStreaming;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatError = (state) => state.chat.error;