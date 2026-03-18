import useChat from "../../hooks/useChat";
import AnswerCard from "./AnswerCard";

const ChatContainer = () => {
  const { messages, isStreaming, streamingText, activeChatId } = useChat();

  const chatTitle = messages.find(m => m.role === "user")?.content || "New Chat";

  return (
    <div className="chat-content">
      {messages.map((msg, index) => (
        <div key={msg._id || index} className={`chat-message ${msg.role}`}>
          {msg.role === "user" ? (
            <>
              <div className="user-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User avatar" />
              </div>
              <h2 className="user-query">{msg.content}</h2>
            </>
          ) : (
            <AnswerCard 
              content={msg.content} 
              sources={msg.sources} 
              chatId={activeChatId}
              chatTitle={chatTitle}
            />
          )}
        </div>
      ))}
      
      {isStreaming && (
        <div className="chat-message ai streaming">
          <AnswerCard 
            content={streamingText} 
            isStreaming={true} 
            chatId={activeChatId}
            chatTitle={chatTitle}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
