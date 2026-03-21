import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  Bookmark,
  Download,
} from "lucide-react";
import Sources from "./Sources";
import { useState } from "react";
import { useSelector } from "react-redux";

import lightImage from "../../assets/images/perplexity-icon-light.png";
import darkImage from "../../assets/images/perplexity-icon-dark.png";

const AnswerCard = ({ content, sources, isStreaming, chatId, chatTitle }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSaved, setIsSaved] = useState(() => {
    if (chatId) {
      const saved = JSON.parse(localStorage.getItem("savedChats")) || [];
      return saved.some((c) => c.id === chatId);
    }
    return false;
  });
  const theme = useSelector((state) => state.theme.theme);
  const isImageResponse = content?.startsWith("![Generated Image]");

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type) => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  const handleSave = () => {
    if (!chatId) return;
    const saved = JSON.parse(localStorage.getItem("savedChats")) || [];
    if (isSaved) {
      const updated = saved.filter((c) => c.id !== chatId);
      localStorage.setItem("savedChats", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      saved.push({
        id: chatId,
        title: chatTitle,
        date: new Date().toISOString(),
      });
      localStorage.setItem("savedChats", JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  const handleDownloadImage = () => {
    const match = content.match(/\((.*?)\)/);
    if (match && match[1]) {
      const url = match[1];
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const customUrlTransform = (url) => {
    if (url.startsWith("data:image/")) {
      return url;
    }
    return defaultUrlTransform(url);
  };

  return (
    <div className="answer-card">
      <div className="answer-header">
        <div className="ai-icon">
          {/* Perplexity icon placeholder */}
          <span className="icon-p">
            <img
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                background: theme === "light" ? "#0f172a" : "#f1f5f9",
                borderRadius: "6px",
                padding: "2px",
              }}
              src={theme === "dark" ? darkImage : lightImage}
              alt="answerLogo"
            />
          </span>
        </div>
        <span className="answer-title">Answer</span>
      </div>

      {sources && sources.length > 0 && <Sources sources={sources} />}

      <div className="answer-content">
        <ReactMarkdown urlTransform={customUrlTransform}>
          {content}
        </ReactMarkdown>
        {isStreaming && <span className="cursor-blink">|</span>}
      </div>

      {!isStreaming && (
        <div className="answer-actions">
          {isImageResponse ? (
            <button
              className="action-btn"
              title="Download Image"
              onClick={handleDownloadImage}
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          ) : (
            <>
              <button className="action-btn" title="Copy" onClick={handleCopy}>
                {copied ? (
                  <Check size={16} color="#10b981" />
                ) : (
                  <Copy size={16} />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                className={`action-btn ${isSaved ? "active" : ""}`}
                title={isSaved ? "Saved" : "Save to Library"}
                onClick={handleSave}
              >
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
              <button
                className={`action-btn ${feedback === "like" ? "active" : ""}`}
                title="Good response"
                onClick={() => handleFeedback("like")}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                className={`action-btn ${feedback === "dislike" ? "active" : ""}`}
                title="Bad response"
                onClick={() => handleFeedback("dislike")}
              >
                <ThumbsDown size={16} />
              </button>
              <button className="action-btn" title="Share">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerCard;
