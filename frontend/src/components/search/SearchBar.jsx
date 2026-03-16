import { Eye, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import useChat from "../../hooks/useChat"
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const {handleSendMessage} = useChat()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSendMessage(query)
      setQuery("")
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <textarea 
        className="search-input"
        placeholder="Ask anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={1}
      />
      <div className="search-actions">
        <div className="search-actions-left">
          <button type="button" className="action-btn icon-btn" title="Focus">
            <Eye size={18} />
          </button>
          <button type="button" className="action-btn icon-btn" title="Attach">
            <Plus size={18} />
          </button>
          <button type="button" className="action-btn pro-toggle">
            Pro <span className="pro-dot"></span>
          </button>
        </div>
        
        <button 
          type="submit" 
          className={`ask-btn ${query.trim() ? "active" : ""}`}
          disabled={!query.trim()}
        >
          <span>Ask AI</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
