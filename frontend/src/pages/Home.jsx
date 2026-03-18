import SearchBar from "../components/search/SearchBar";
import PromptList from "../components/search/PromptList";
import ChatContainer from "../components/chat/ChatContainer";
import useChat from "../hooks/useChat";
import { ChevronRight } from "lucide-react";

const Home = () => {
  const { activeChatId } = useChat();

  return (
    <div className={`home-page ${activeChatId ? "chat-mode" : ""}`}>
      {!activeChatId ? (
        <>
          <div className="home-page__header">
            <h1 className="home-page__title">Where knowledge begins</h1>
            <p className="home-page__subtitle">Ask anything and get instant AI-powered answers.</p>
          </div>

          <SearchBar />
          
          <PromptList />

          <div className="home-page__pro-link">
            Try Pro to get smarter answers <ChevronRight size={14} />
          </div>
        </>
      ) : (
        <>
          <div className="chat-container-wrapper">
            <ChatContainer />
          </div>
          <div className="chat-search-wrapper">
             <SearchBar />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
