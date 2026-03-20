import ThreadItem from "./ThreadItem";
import { useEffect } from "react";
import useChat from "../../hooks/useChat";


const ThreadList = () => {
  const { chats, activeChatId, handleSelectChat, handleDeleteChat, loadChats } = useChat();

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="thread-list">
      {chats.map((chat) => (
        <ThreadItem
          key={chat._id}
          title={chat.title}
          isActive={activeChatId === chat._id}
          onSelect={() => handleSelectChat(chat._id)}
          onDelete={() => handleDeleteChat(chat._id)}
        />
      ))}
    </div>
  );
};

export default ThreadList;
