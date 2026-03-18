import { useDispatch, useSelector } from "react-redux";
import socket from "../services/socket";
import {
  sendMessage,
  fetchChats,
  fetchChatMessages,
  deleteChat,
  setActiveChatId,
  clearChat as clearChatAction,
} from "../features/chat/chatSlice";
import {
  selectChats,
  selectMessages,
  selectStreamingText,
  selectIsStreaming,
  selectActiveChatId,
  selectChatLoading,
} from "../features/chat/chatSelectors";

const useChat = () => {
  const dispatch = useDispatch();

  const chats = useSelector(selectChats);
  const messages = useSelector(selectMessages);
  const streamingText = useSelector(selectStreamingText);
  const isStreaming = useSelector(selectIsStreaming);
  const activeChatId = useSelector(selectActiveChatId);
  const isLoading = useSelector(selectChatLoading);

  // Listeners moved to App.jsx to prevent duplicate events  

  const handleSendMessage = (query) => {
    dispatch(sendMessage({ query, chatId: activeChatId }));
  };

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChatId(chatId));
    dispatch(fetchChatMessages(chatId));
    socket.emit("join:chat", chatId);  // rejoin room when switching chats
  };

  const handleDeleteChat = (chatId) => {
    dispatch(deleteChat(chatId));
  };

  const loadChats = () => {
    dispatch(fetchChats());
  };

  const clearChat = () => {
    dispatch(clearChatAction());
  };

  return {
    chats,
    messages,
    streamingText,
    isStreaming,
    activeChatId,
    isLoading,
    handleSendMessage,
    handleSelectChat,
    handleDeleteChat,
    loadChats,
    clearChat,
  };
};

export default useChat;