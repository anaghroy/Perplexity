# 🔍 Perplexity AI Clone

A full-stack, real-time AI search and research engine built to replicate the core experience of Perplexity AI. This application leverages multiple Large Language Models (LLMs) and real-time web search to provide users with highly accurate, grounded, and multi-modal answers.

## 🛠️ Technologies Used

**Frontend:**
- **React (Vite)** – High-performance UI rendering
- **Redux Toolkit** – Global state management for active chats and threads
- **SCSS (Sass)** – Custom responsive styling (Masonry grids, themes)
- **Socket.io-Client** – Real-time token streaming
- **Lucide React** – Clean, modern iconography
- **React Markdown** – Parsing AI responses (including Base64 image URIs)

**Backend:**
- **Node.js & Express** – Scalable server architecture
- **MongoDB (Mongoose)** – Chat history and user persistence
- **Socket.io** – Real-time bidirectional event streaming
- **JWT & Google OAuth** – Secure session management
- **Multer & PDF-Parse** – In-memory file and document processing

**AI & Pipelines:**
- **LangChain** – Orchestrating models and prompts
- **Groq, Google GenAI, Mistral** – Fast, diverse LLM inferencing
- **Tavily API** – Live web search and context grounding
- **HuggingFace Inference** – Image generation (Stable Diffusion) & Audio transcription

---

## ✨ Features: What Users Can Do

- 💬 **Real-time AI Chat**: Ask questions and watch the AI stream answers token-by-token for a frictionless experience.
- 🌐 **Web Grounding**: Search queries are augmented with real-time web results (via Tavily) to provide accurate, up-to-date citations.
- 📄 **PDF Summarization**: Upload complex PDF documents; the app parses the text and summarizes it instantly.
- 🎨 **Image Generation**: Ask the AI to visualize concepts, and it will generate and stream high-quality images directly into the chat.
- 🎙️ **Voice Input**: Use your microphone to transcribe audio directly into the search bar.
- 📚 **Library & Threads**: Save favorite chats, manage your history, and switch between conversation threads effortlessly.
- 🌓 **Dark/Light Mode**: Seamlessly toggle between beautifully crafted UI themes.

---

## ⌨️ Keyboard Shortcuts

Speed up your research with these global hotkeys:

- `Ctrl/Cmd + K` : Focus the main search bar
- `Ctrl/Cmd + J` : Start a new chat thread
- `Ctrl/Cmd + Enter` : Submit query
- `Esc` : Close modals / unfocus inputs

---

## 🏗️ The Process: How I Built It

1. **Foundational Architecture:** Started by setting up a robust Express backend and a React/Vite frontend. Integrated MongoDB to establish user accounts and chat threading.
2. **AI & Search Integration:** Implemented LangChain to abstract interactions with multiple LLMs. Integrated the Tavily API to fetch real-time web context, feeding it into LangChain prompt templates to ground the AI's answers.
3. **Real-Time Streaming:** Standard HTTP requests were too slow for a ChatGPT-like feel. I integrated `Socket.io`, modeling the AI generation as an event stream. I had to carefully manage Redux state on the frontend to append tokens rapidly without causing expensive re-renders.
4. **Multi-Modal Expansions:** Added `multer` and `pdf-parse` to handle document uploads. Integrated HuggingFace's inference endpoints to add Text-to-Image and Audio transcription capabilities directly into the chat pipeline.
5. **UI/UX Polish:** Designed the frontend using SCSS, focusing on responsive masonry grids for the Discover page, handling custom markdown parsing for Base64 image URIs, and implementing secure JWT Http-Only cookies with a token blacklist for authentication.

---

## 🧠 What I Learned

- **WebSocket State Management:** Managing React state when receiving thousands of rapid token updates from Socket.io required deep optimization using Redux to prevent the UI from freezing.
- **LLM Orchestration:** Using LangChain opened my eyes to how powerful prompt chaining and Retrieval-Augmented Generation (RAG) can be when combined with live web search APIs like Tavily.
- **Handling Binary Data:** Learning how to process raw file buffers for PDFs and safely render `data:image/` Base64 URIs within standard Markdown parsers without triggering XSS protections.

---

## 🚀 How It Could Be Improved

- **Redis Caching:** Caching frequent queries or heavily accessed web contexts using Redis to reduce latency and API costs.
- **Stripe Integration:** Adding premium tiers to unlock higher-tier models (like GPT-4o or Claude 3.5 Sonnet) and unlimited image generations.
- **React Native App:** Porting the responsive web UI into a dedicated mobile application for iOS and Android.

---

## 💻 How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Perplexity.git
cd Perplexity
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HUGGINGFACE_API_KEY=your_huggingface_key
TAVILY_API_KEY=your_tavily_key
GROQ_API_KEY=your_groq_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🎥 Live Project Demo

![Live Demo]([https://via.placeholder.com/800x450.png?text=Video+Demo+Coming+Soon](https://github.com/anaghroy/Perplexity/releases/download/v1.0.0/output_progressive_362b1a36-b3a6-4bf1-ac80-a18db7cfca98.mp4))

