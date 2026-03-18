import ReactMarkdown from "react-markdown";
import { Copy, ThumbsUp, ThumbsDown, Share2, Check, Bookmark } from "lucide-react";
import Sources from "./Sources";
import { useState } from "react";

const AnswerCard = ({ content, sources, isStreaming, chatId, chatTitle }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSaved, setIsSaved] = useState(() => {
    if (chatId) {
      const saved = JSON.parse(localStorage.getItem("savedChats")) || [];
      return saved.some(c => c.id === chatId);
    }
    return false;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type) => {
    setFeedback(prev => (prev === type ? null : type));
  };

  const handleSave = () => {
    if (!chatId) return;
    const saved = JSON.parse(localStorage.getItem("savedChats")) || [];
    if (isSaved) {
      const updated = saved.filter(c => c.id !== chatId);
      localStorage.setItem("savedChats", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      saved.push({ id: chatId, title: chatTitle, date: new Date().toISOString() });
      localStorage.setItem("savedChats", JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  return (
    <div className="answer-card">
      <div className="answer-header">
        <div className="ai-icon">
          {/* Perplexity icon placeholder */}
          <span className="icon-p">P</span>
        </div>
        <span className="answer-title">Answer</span>
      </div>

      {sources && sources.length > 0 && <Sources sources={sources} />}
      
      <div className="answer-content">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="cursor-blink">|</span>}
      </div>

      {!isStreaming && (
        <div className="answer-actions">
          <button className="action-btn" title="Copy" onClick={handleCopy}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button 
            className={`action-btn ${isSaved ? 'active' : ''}`} 
            title={isSaved ? "Saved" : "Save to Library"}
            onClick={handleSave}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
          <button 
            className={`action-btn ${feedback === 'like' ? 'active' : ''}`} 
            title="Good response"
            onClick={() => handleFeedback('like')}
          >
            <ThumbsUp size={16} />
          </button>
          <button 
            className={`action-btn ${feedback === 'dislike' ? 'active' : ''}`} 
            title="Bad response"
            onClick={() => handleFeedback('dislike')}
          >
            <ThumbsDown size={16} />
          </button>
          <button className="action-btn" title="Share">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AnswerCard;
