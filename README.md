# AIra — Advanced Autonomous AI Agent System 🦾🤖

AIra is a premium, minimalist, and high-performance AI assistant built for the modern age. It leverages a multi-model agentic architecture to provide seamless text, vision, and document analysis — all while maintaining a state-of-the-art UI inspired by industry leaders like Claude and Gemini.

---

## 🧠 Core System Architecture

AIra is not just a chatbot; it's a sophisticated **Agentic System** that dynamically routes tasks based on complexity and modality.

-   **Multi-Model Router**: Automatically switches between models based on task intent:
    -   ⚡ **Llama 3.2:1b**: Optimized for lightning-fast, simple conversational updates.
    -   🧠 **Gemma 3:4b**: The 'Heavy Reasoning' engine used for complex coding, analysis, and RAG.
    -   👁️ **Moondream:latest**: Dedicated vision engine for high-fidelity image analysis.
-   **Neural episodic Memory (RAG)**: Integrates **ChromaDB** for vector-based long-term memory, allowing AIra to "learn" from your uploaded documents and past interactions.
-   **Real-time Synchronization**: Powered by **Socket.io** for fluid, streaming responses and instantaneous state updates.

---

## ✨ Key Features

### 🎨 Minimalist & Premium UI
- **Unified Sidebar**: Full session history management (View, Rename, Delete) with persistent "Recent History" and "Tools & Settings" sections.
- **Fluid Layout**: Scrollable chat history with a fixed, glowing prompt area and bottom-positioned user badges.
- **Cinematic Experience**: A GSAP-powered "Click to Initialize" splash screen ensures browser-compliant audio playback and a professional reveal.

### 📎 Advanced File & Document Intel
- **Universal Attachment**: Support for **PDF, Word (.docx), and Text** file processing.
- **Local RAG Integration**: Uploaded documents are instantly indexed into the local vector store for context-aware Q&A.
- **Vision Pro**: Real-time image previews in the chat UI with contextual analysis via a dedicated vision model.

### 🎤 Voice & Multimodal Interaction
- **Speech-to-Text**: Native Web Speech API integration for hands-free interaction.
- **Automatic History tracking**: Every session is unique and persisted, allowing for multi-threaded workflows.

---

## 🛠️ Tech Stack

-   **Frontend**: Vanilla HTML5/CSS3, JavaScript (ES6+), GSAP (Animations), Marked.js (Markdown), Highlight.js (Syntax Highlighting).
-   **Backend**: Node.js, Express.js (REST/Static), Socket.io (Real-time).
-   **Storage**: ChromaDB (Vector Search), Episodic Memory (JSON-based persistence).
-   **LLM Runtime**: Ollama (Running local LLMs for privacy and zero latency).
-   **Deployment**: Optimized for Vercel/Self-hosted.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.com/) (Required for Local LLMs)
- Models required: `llama3.2:1b`, `gemma3:4b`, `moondream:latest`

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Pranavrai207/Aira.git
    cd Aira
    ```
2.  **Install Dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Environment Setup**: Create a `.env` file in the root directory:
    ```env
    PORT=3001
    OLLAMA_BASE_URL=http://localhost:11434
    CHROMA_URL=http://localhost:8000
    DATA_DIR=./data
    ```

### Running the Application
```bash
npm run dev
```
Visit `http://localhost:3001` to initialize AIra.

---

## 📅 Roadmap & Future Enhancements
- [ ] **Cloud Persistence**: Migration to PostgreSQL for enterprise-grade history tracking.
- [ ] **Internet Access**: Integrated browsing tool for real-time data retrieval.
- [ ] **Voice Synthesis (TTS)**: Adding high-quality character voice responses.

---

## 👨‍💻 Author
**Pranav** — Senior Systems Architect & UI Designer.

---
*Built with ❤️ for a minimalist future.*
