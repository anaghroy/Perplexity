import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../services/socket";
import {
  sendMessage,
  fetchChats,
  fetchChatMessages,
  deleteChat,
  setActiveChatId,
  appendChunk,
  streamingDone,
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

  // Listen for socket streaming events
  useEffect(() => {
    socket.on("ai:chunk", ({ chunk }) => {
      dispatch(appendChunk(chunk));
    });

    socket.on("ai:done", ({ sources }) => {
      dispatch(streamingDone({ sources }));
    });

    socket.on("ai:error", ({ message }) => {
      console.error("AI streaming error:", message);
      dispatch(streamingDone({}));
    });

    return () => {
      socket.off("ai:chunk");
      socket.off("ai:done");
      socket.off("ai:error");
    };
  }, [dispatch]);

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
  };
};

export default useChat;