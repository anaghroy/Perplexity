import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const chats = useSelector(selectChats);
  const messages = useSelector(selectMessages);
  const streamingText = useSelector(selectStreamingText);
  const isStreaming = useSelector(selectIsStreaming);
  const activeChatId = useSelector(selectActiveChatId);
  const isLoading = useSelector(selectChatLoading);

  const handleSendMessage = async (query) => {
    const result = await dispatch(sendMessage({ query, chatId: activeChatId }));

    const newChatId = result?.payload?.chatId;
    if (newChatId && newChatId !== activeChatId) {
      dispatch(setActiveChatId(newChatId));
      socket.emit("join:chat", newChatId);
    }

    dispatch(fetchChats());
  };

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChatId(chatId));
    dispatch(fetchChatMessages(chatId));
    socket.emit("join:chat", chatId); // rejoin room when switching chats
    navigate("/");
  };

  const handleDeleteChat = (chatId) => {
    dispatch(deleteChat(chatId));
  };

  const loadChats = () => {
    dispatch(fetchChats());
  };

  const clearChat = () => {
    dispatch(clearChatAction());
    navigate("/");
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
