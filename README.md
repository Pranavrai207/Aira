# Aira — The Elite Hybrid AI Assistant

**Aira** is a premium, "Cloud-First" hybrid AI assistant designed for high-performance reasoning and a cinematic user experience. Built with a robust failover architecture, it seamlessly transitions between massive cloud models and local privacy-focused instances.

![Aira UI](assets/logo.png) <!-- Ensure logo exists or just use text -->

## 🚀 Key Features

### 1. **Hybrid Cloud-First Architecture**
- **Ollama Cloud Primary**: Leverages extreme-scale models like **Cogito 2.1 671B** and **Gemma 3 12B** via `https://ollama.com`.
- **Intelligent Local Fallback**: Automatically redirects requests to a local Ollama instance (`localhost:11434`) if the cloud is unreachable.
- **Failover Mapping**: Dynamically maps complex cloud tasks to the best available local models (e.g., `gemma3:4b`).

### 2. **Cinematic User Experience**
- **Buttery Smooth Streaming**: Uses a high-performance **Buffered Renderer** (15fps) to eliminate markdown flickering and layout jumps.
- **Top-Notch Formatting**: Elite typography using the `Outfit` font, large hierarchical headings (H1-H3), and generous semantic spacing.
- **Glassmorphism UI**: High-end visual effects including backdrop blurs, glide-in animations, and a dynamic typing cursor.
- **Integrated Utilities**: Direct "Copy Code" buttons on all snippets and a persistent Memory Recap (RAG) system.

### 3. **Memory & Context**
- **RAG-Ready**: Integrated document parsing (PDF/Images) with vector search capabilities.
- **Conversational Recall**: Persistent session history with a clean, searchable sidebar.

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- [Ollama](https://ollama.com) (Both Cloud account and Local instance installed)

### Environment Configuration
Create a `.env` file in the root directory:
```env
# Ollama Cloud Configuration
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_API_KEY=your_cloud_api_key_here

# Local Fallback Configuration
LOCAL_OLLAMA_URL=http://localhost:11434

# Server Config
PORT=3001
```

### Installation
```bash
npm install
npm run dev
```

---

## 🧬 Tech Stack
- **Frontend**: Vanilla JS, CSS (Glassmorphism), GSAP (Animations), Marked.js (Markdown), Highlight.js (Code).
- **Backend**: Node.js, Express, Socket.io (Real-time Streaming).
- **AI Engines**: Ollama (Cloud & Local).

---

## 🤝 Contributing
Built with ❤️ by Pranav. Designed for the future of agentic AI. 

---
*Verified: Stable, Hybrid, and Cinematic.*
