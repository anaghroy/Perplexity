import { Search, Paperclip, Mic, Image as ImageIcon, ArrowRight, MicOff, FileText, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import useChat from "../../hooks/useChat";
import { useDispatch } from "react-redux";
import { injectMessage } from "../../features/chat/chatSlice";
import { transcribeAudioAPI, summarizeDocumentAPI, generateImageAPI } from "../../features/ai/aiAPI";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { handleSendMessage } = useChat();
  const dispatch = useDispatch();

  const [activeModel, setActiveModel] = useState("text"); // 'text' | 'image'
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query || typeof query !== 'string' || !query.trim() || isProcessing) return;

    if (activeModel === "image") {
      // Handle Image Generation
      setIsProcessing(true);
      dispatch(injectMessage({ role: "user", content: `Generate an image: ${query}` }));
      
      try {
        const res = await generateImageAPI(query);
        const imageUrlData = res.data;
        const imageUrl = typeof imageUrlData === 'string' ? imageUrlData : (imageUrlData.url || imageUrlData.image || JSON.stringify(imageUrlData));
        dispatch(injectMessage({ role: "ai", content: `![Generated Image](${imageUrl})` }));
      } catch (err) {
        dispatch(injectMessage({ role: "ai", content: `**Error generating image**: ${err.message}` }));
      } finally {
        setIsProcessing(false);
        setQuery("");
      }
    } else {
      // Standard Chat
      handleSendMessage(query);
      setQuery("");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile(file);
    setIsProcessing(true);
    
    try {
      const res = await summarizeDocumentAPI(file);
      const summaryData = res.data;
      const summaryText = typeof summaryData === 'string' ? summaryData : (summaryData.summary || summaryData.text || JSON.stringify(summaryData));
      
      dispatch(injectMessage({ role: "user", content: `Summarize document: ${file.name}` }));
      dispatch(injectMessage({ role: "ai", content: `**Document Summary (${file.name}):**\n\n${summaryText}` }));
    } catch (err) {
      dispatch(injectMessage({ role: "user", content: `Summarize document: ${file.name}` }));
      dispatch(injectMessage({ role: "ai", content: `**Error summarizing document**: ${err.message}` }));
    } finally {
      setIsProcessing(false);
      setAttachedFile(null);
      e.target.value = null; // reset input
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          
          setIsProcessing(true);
          try {
            const res = await transcribeAudioAPI(audioBlob);
            const transcribedData = res.data;
            const transcribedText = typeof transcribedData === 'string' ? transcribedData : (transcribedData.text || JSON.stringify(transcribedData));
            setQuery(prev => (prev ? prev + " " + transcribedText : transcribedText));
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setIsProcessing(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    }
  };

  return (
    <form className="search-container" style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
      {/* Attached File UI Pill */}
      {attachedFile && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", 
          borderBottom: "1px solid var(--border-color)", borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem",
          backgroundColor: isProcessing ? "rgba(6, 182, 212, 0.05)" : "transparent"
        }}>
          <FileText size={16} color="var(--text-secondary)" />
          <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: "500", color: "var(--text-primary)" }}>
            {attachedFile.name}
          </span>
          {isProcessing && <Loader2 className="spin-animation" size={14} color="#06b6d4" style={{ animation: "spin 1s linear infinite" }} />}
        </div>
      )}

      {/* Embedded CSS for Loader animation if not defined globally */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <textarea 
        className="search-input"
        placeholder={isRecording ? "Listening..." : "Ask anything..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={1}
        disabled={isProcessing}
        style={{ padding: attachedFile ? "0.5rem 1rem 1rem 1rem" : undefined }}
      />
      <div className="search-actions">
        <div className="search-actions-left">
          {/* Search Mode Icon */}
          <button 
            type="button" 
            className={`action-btn icon-btn ${activeModel === 'text' ? 'active' : ''}`} 
            title="Chat Mode"
            onClick={() => setActiveModel("text")}
            style={activeModel === 'text' ? { color: 'var(--text-primary)', backgroundColor: 'var(--hover-bg)' } : {}}
          >
            <Search size={18} />
          </button>
          
          {/* Upload PDF Icon */}
          <button 
            type="button" 
            className="action-btn icon-btn" 
            title="Upload PDF"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Paperclip size={18} />
          </button>
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            style={{ display: 'none' }} 
          />
          
          {/* Voice Recording Icon */}
          <button 
            type="button" 
            className={`action-btn icon-btn ${isRecording ? 'recording' : ''}`} 
            title={isRecording ? "Stop Recording" : "Voice Input"}
            onClick={toggleRecording}
            disabled={isProcessing && !isRecording}
          >
            {isRecording ? <MicOff size={18} color="#ef4444" /> : <Mic size={18} />}
          </button>

          {/* Model / Image Icon */}
          <button 
            type="button" 
            className={`action-btn pro-toggle ${activeModel === 'image' ? 'active' : ''}`}
            title="Image Generation Mode"
            onClick={() => setActiveModel(activeModel === 'image' ? 'text' : 'image')}
            style={activeModel === 'image' ? { color: 'var(--text-primary)', backgroundColor: 'var(--hover-bg)', display: "flex", gap: "6px", alignItems: "center" } : { display: "flex", gap: "6px", alignItems: "center" }}
          >
            <ImageIcon size={14} /> Image <span className="pro-dot"></span>
          </button>
        </div>
        
        <button 
          type="submit" 
          className={`ask-btn ${(typeof query === 'string' && query.trim() || activeModel === 'image') && !isProcessing ? "active" : ""}`}
          disabled={typeof query !== 'string' || !query.trim() || isProcessing}
        >
          <span>{isProcessing ? "Processing..." : (activeModel === 'image' ? "Generate" : "Ask AI")}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
