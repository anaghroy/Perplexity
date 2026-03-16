import axiosInstance from "../../services/axiosInstance";

export const sendMessageAPI = async ({ query, chatId }) => {
  const res = await axiosInstance.post("/api/chat", { query, chatId });
  return res.data; // { success, chatId }
};

export const getChatsAPI = async () => {
  const res = await axiosInstance.get("/api/chat");
  return res.data; // { success, data: chats[] }
};

export const getChatMessagesAPI = async (chatId) => {
  const res = await axiosInstance.get(`/api/chat/${chatId}/messages`);
  return res.data; // { success, data: messages[] }
};

export const deleteChatAPI = async (chatId) => {
  const res = await axiosInstance.delete(`/api/chat/${chatId}`);
  return res.data;
};