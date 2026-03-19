import { Search, Paperclip, Mic, Image as ImageIcon, ArrowRight, MicOff, FileText, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import useChat from "../../hooks/useChat";
import { useDispatch } from "react-redux";
import { injectMessage } from "../../features/chat/chatSlice";
import { transcribeAudioAPI, summarizeDocumentAPI } from "../../features/ai/aiAPI";
import { generateImage } from "../../features/chat/chatSlice";

/* ─── Floating Listening Modal ─────────────────────────────────────────────── */
const ListeningModal = ({ onStop }) => (
  <div className="listening-overlay" onClick={(e) => e.target === e.currentTarget && onStop()}>
    <div className="listening-ring-wrap">
      <div className="ring ring-3" />
      <div className="ring ring-2" />
      <div className="ring ring-1" />
      <div className="mic-circle">
        <Mic size={30} color="#fff" />
      </div>
    </div>
    <p className="listening-label">Listening…</p>
    <button type="button" className="stop-recording-btn" onClick={onStop}>
      <MicOff size={16} />
      Stop Recording
    </button>
  </div>
);

/* ─── SearchBar ─────────────────────────────────────────────────────────────── */
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { handleSendMessage, activeChatId } = useChat();
  const dispatch = useDispatch();

  const [activeModel, setActiveModel] = useState("text");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query || typeof query !== "string" || !query.trim() || isProcessing) return;

    if (activeModel === "image") {
      // generateImage thunk handles everything:
      // - adds user message optimistically
      // - calls backend (creates chat if needed, uploads to ImageKit, saves message)
      // - sets activeChatId even on a brand new thread
      // - adds AI image message to Redux state on success
      setIsProcessing(true);
      await dispatch(generateImage({ prompt: query, chatId: activeChatId }));
      setIsProcessing(false);
      setQuery("");
    } else {
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
      const summaryText =
        typeof summaryData === "string"
          ? summaryData
          : summaryData.summary || summaryData.text || JSON.stringify(summaryData);

      dispatch(injectMessage({ role: "user", content: `Summarize document: ${file.name}` }));
      dispatch(injectMessage({ role: "ai", content: `**Document Summary (${file.name}):**\n\n${summaryText}` }));
    } catch (err) {
      dispatch(injectMessage({ role: "user", content: `Summarize document: ${file.name}` }));
      dispatch(injectMessage({ role: "ai", content: `**Error summarizing document**: ${err.message}` }));
    } finally {
      setIsProcessing(false);
      setAttachedFile(null);
      e.target.value = null;
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        setIsProcessing(true);
        try {
          const res = await transcribeAudioAPI(audioBlob);
          const transcribedData = res.data;
          const transcribedText =
            typeof transcribedData === "string"
              ? transcribedData
              : transcribedData.transcript
              || transcribedData.text
              || JSON.stringify(transcribedData);

          setQuery((prev) => (prev ? prev + " " + transcribedText : transcribedText));
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
  };

  return (
    <>
      {isRecording && <ListeningModal onStop={stopRecording} />}

      <form className="search-container" onSubmit={handleSubmit}>
        {attachedFile && (
          <div className={`file-pill${isProcessing ? " file-pill--processing" : ""}`}>
            <FileText size={16} className="file-pill__icon" />
            <span className="file-pill__name">{attachedFile.name}</span>
            {isProcessing && <Loader2 size={14} className="file-pill__spinner" />}
          </div>
        )}

        <textarea
          className="search-input"
          placeholder={isProcessing ? "Transcribing..." : "Ask anything..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={1}
          disabled={isProcessing}
        />

        <div className="search-actions">
          <div className="search-actions-left">
            <button
              type="button"
              className={`action-btn icon-btn${activeModel === "text" ? " active" : ""}`}
              title="Chat Mode"
              onClick={() => setActiveModel("text")}
            >
              <Search size={18} />
            </button>

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
              className="file-input-hidden"
            />

            <button
              type="button"
              className={`action-btn icon-btn${isRecording ? " recording" : ""}`}
              title="Voice Input"
              onClick={toggleRecording}
              disabled={isProcessing && !isRecording}
            >
              <Mic size={18} />
            </button>

            <button
              type="button"
              className={`action-btn pro-toggle${activeModel === "image" ? " active" : ""}`}
              title="Image Generation Mode"
              onClick={() => setActiveModel(activeModel === "image" ? "text" : "image")}
            >
              <ImageIcon size={14} /> Image <span className="pro-dot" />
            </button>
          </div>

          <button
            type="submit"
            className={`ask-btn${typeof query === "string" && query.trim() && !isProcessing ? " active" : ""}`}
            disabled={typeof query !== "string" || !query.trim() || isProcessing}
          >
            <span>{isProcessing ? "Processing..." : activeModel === "image" ? "Generate" : "Ask AI"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </>
  );
};

export default SearchBar;