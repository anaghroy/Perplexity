import ThreadItem from "./ThreadItem";
import { useEffect } from "react";
import useChat from "../../hooks/useChat";


const ThreadList = () => {
  const { chats, handleSelectChat, handleDeleteChat, loadChats } = useChat();

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="thread-list">
      {chats.map((chat) => (
        <ThreadItem
          key={chat.id}
          title={chat.title}
          onSelect={() => handleSelectChat(chat._id)}
          onDelete={() => handleDeleteChat(chat._id)}
        />
      ))}
    </div>
  );
};

export default ThreadList;
