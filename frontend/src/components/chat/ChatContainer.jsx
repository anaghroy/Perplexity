import { useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import useChat from "../../hooks/useChat";
import AnswerCard from "./AnswerCard";

// Primary: msg.type === "image" (stored in DB)
const isImageMessage = (msg) =>
  msg.type === "image" ||
  (typeof msg.content === "string" && msg.content.includes("ik.imagekit.io"));

// Extract a clean filename from the ImageKit URL
const getFileName = (url, ext = "jpeg") => {
  try {
    const parts = new URL(url).pathname.split("/");
    const raw = parts[parts.length - 1]; // e.g. "astronaut-1773900890636.jpg"
    const base = raw.replace(/\.[^.]+$/, "");  // strip existing extension
    return `${base}.${ext}`;
  } catch {
    return `ai-generated.${ext}`;
  }
};

// Download button — fetches image as blob to bypass cross-origin restrictions
const DownloadButton = ({ url, format }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
     
      const downloadUrl = format === "png"
        ? `${url}?f-png`     // ImageKit transforms to PNG
        : url;               // JPEG is the native format

      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = getFileName(url, format);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`image-download-btn${loading ? " loading" : ""}`}
      onClick={handleDownload}
      disabled={loading}
      title={`Download as ${format.toUpperCase()}`}
    >
      {loading
        ? <Loader2 size={14} className="spin" />
        : <Download size={14} />
      }
      {loading ? "Downloading…" : format.toUpperCase()}
    </button>
  );
};

// ── Generated image card ────────────────────────────────────────────────────
const GeneratedImageCard = ({ url }) => (
  <div className="generated-image-card">
    <img
      src={url}
      alt="AI generated"
      className="generated-image"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "block";
      }}
    />
    <p className="generated-image-error" style={{ display: "none" }}>
      Image failed to load.
    </p>

    {/* Action bar */}
    <div className="image-actions">
      <div className="image-download-group">
        <DownloadButton url={url} format="jpeg" />
        <DownloadButton url={url} format="png" />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="image-open-link"
        title="Open full size"
      >
        <ExternalLink size={14} />
        Full size
      </a>
    </div>
  </div>
);

// ── ChatContainer ───────────────────────────────────────────────────────────
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
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                  alt="User avatar"
                />
              </div>
              <h2 className="user-query">{msg.content}</h2>
            </>
          ) : isImageMessage(msg) ? (
            <GeneratedImageCard url={msg.content} />
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