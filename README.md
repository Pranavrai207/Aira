# Aira — Advanced Hybrid-Cloud Agentic System

Aira is a production-grade, "Cloud-First" AI assistant designed to bridge the gap between extreme-scale cloud reasoning and local privacy-centric processing. Engineering with a focus on cinematic user experience and high-availability architecture, Aira represents a modern approach to persistent, agentic AI.

---

## 🏗️ System Architecture

Aira implements a **Hybrid Routing Strategy** that prioritizes powerful cloud-hosted LLMs while maintaining a seamless, zero-config fallback to local resources.

### 1. **Hybrid LLM Orchestration**
- **Primary Host**: Proxied through `https://ollama.com` (Cloud) for massive parameter models like **Cogito 671B**.
- **Local Fallback**: Automatic redirects to `localhost:11434` (Local Ollama) in the event of cloud latency or connectivity issues.
- **Failover Mapping**: Intelligent model translation ensures that a request for a 671B cloud model gracefully downgrades to a highly-capable local model (e.g., `gemma3:4b`) instead of failing.

### 2. **Performance-Optimized Streaming**
- **Buffered Rendering Engine**: Aira uses a custom `SmoothRenderer` logic that batches incoming tokens at a steady 15-20 FPS. This prevents DOM reflow bottlenecks and prevents the "flicker" common in naive markdown streaming implementations.
- **Zero-Latency Initial Render**: The first token bypasses the buffer for immediate visual feedback (low perceived TTFT).

---

## ✨ Premium Feature Set

### 🎨 Visual Excellence (UX/UI)
- **Glassmorphism Design**: Cinematic interface using backdrop-blur effects and fluid CSS transitions.
- **Dynamic Typography**: Leveraging the `Outfit` font for hierarchical headers and `Inter` for highly readable body text.
- **GSAP Animations**: Fluid message entry and UI state transitions orchestrates by the GSAP library.

### 🧠 Intelligence & Tools
- **RAG Integration**: Built-in support for document indexing and conversational recall.
- **Code Intelligence**: High-fidelity syntax highlighting via `Highlight.js` with integrated "Copy to Clipboard" utilities.
- **Streaming Vision**: Deep integration with vision-capable models (e.g., `moondream`) for multi-modal interactions.

---

## 🛠️ Technical Setup

### Environment Prerequisites
- **Node.js**: v18.0.0 or higher.
- **Ollama**: Local instance running on port 11434.
- **Network**: Port 3001 must be available for the Express/Socket server.

### Configuration (`.env`)
```env
# Ollama Cloud Hosting
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_API_KEY=your_secure_api_token

# Local Instance Endpoint
LOCAL_OLLAMA_URL=http://localhost:11434

# Server Settings
PORT=3001
```

### Quick Start
1. **Clone & Install**:
   ```bash
   git clone https://github.com/Pranavrai207/Aira.git
   cd Aira
   npm install
   ```
2. **Launch Development Environment**:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
Aira/
├── client/                 # Frontend assets
│   ├── chat/               # Socket logic and Typewriter renderer
│   ├── styles/             # Glassmorphism & Document CSS
│   ├── intro/              # GSAP Sequence & Intro Video logic
│   └── index.html          # Main Application Shell
├── server/                 # Backend infrastructure
│   ├── llm/                # Ollama Hybrid Client & Model Router
│   ├── agents/             # Orchestration & System Prompts
│   └── index.js            # Express & Socket.io Server
├── .env                    # Deployment Configuration
└── README.md               # Senior Engineering Documentation
```

---

## 🛡️ Security & Scalability
Aira is built for scalability. The `OllamaClient` class is designed to be extensible, allowing for the addition of other providers (OpenAI, Anthropic) with minimal refactoring. All cloud requests are authenticated via Bearer tokens, and local traffic remains isolated within the host network.

---

**Developed with Precision by Pranav.**  
*Stable. Hybrid. Cinematic.*
