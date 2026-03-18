import { useState } from "react";
import useChat from "../hooks/useChat";
import { useNavigate } from "react-router";
import { Library as LibraryIcon, Trash2 } from "lucide-react";

const Library = () => {
  const [savedChats, setSavedChats] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("savedChats")) || [];
    saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    return saved;
  });
  const { handleSelectChat } = useChat();
  const navigate = useNavigate();

  const openSavedChat = (chatId) => {
    handleSelectChat(chatId);
    navigate("/");
  };
  
  const removeSavedChat = (e, chatId) => {
    e.stopPropagation();
    const updated = savedChats.filter(c => c.id !== chatId);
    localStorage.setItem("savedChats", JSON.stringify(updated));
    setSavedChats(updated);
  };

  return (
    <div className="library-page" style={{ padding: "10vh 2rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <LibraryIcon size={32} color="var(--text-secondary)" />
        <div>
          <h1 className="library-page__title" style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Library</h1>
          <p className="library-page__subtitle" style={{ color: "var(--text-secondary)", margin: 0 }}>Your saved threads and collections.</p>
        </div>
      </div>

      <div className="saved-chats-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {savedChats.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No saved chats yet. Save a chat from the answer card to see it here.</p>
        ) : (
          savedChats.map(chat => (
            <div 
              key={chat.id} 
              className="saved-chat-card" 
              onClick={() => openSavedChat(chat.id)}
              style={{
                background: "var(--card-bg, #1e1e24)",
                border: "1px solid var(--card-border, #2a2a32)",
                padding: "1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.2s",
                position: "relative"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-bg)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--card-bg, #1e1e24)"}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: "500", margin: "0 0 1rem 0", color: "var(--text-primary)", paddingRight: "1.5rem" }}>
                {chat.title}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {new Date(chat.date).toLocaleDateString()}
              </span>
              <button 
                onClick={(e) => removeSavedChat(e, chat.id)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;
