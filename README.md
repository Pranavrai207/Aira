# AIra — The Autonomous Multimodal Agentic Intelligence 🦾🚀

English · [हिन्दी](README.md) · [Português](README.md) · [简体中文](README.md) · [日本語](README.md)

**A high-performance, context-aware, spec-driven autonomous agent system.**

AIra isn't just a chatbot. It's an agentic engine that solves **modality gap** and **reasoning rot** — the degradation of quality that happens when generalist models try to handle specialized vision, code, and RAG tasks in a single context window.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Pranavrai207/Aira)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Pranavrai207/Aira)

```bash
git clone https://github.com/Pranavrai207/Aira.git && npm install
# Works on Windows, Mac, and Linux.
```

---

> "If you can describe your vision, AIra can build it. Pure execution. No fluff."

> "The most seamless integration of local RAG and Vision I've used. It just works."

---

## Why I Built This
I'm tired of "Vibecoding." You upload an image or a PDF to a standard chat, and the context window gets bloated with junk, leading to hallucinated garbage.

So I built **AIra**. The complexity is in the **Routing Engine**, not your workflow. 
Behind the scenes: **Context Engineering**, **Multi-Model Orchestration**, **Vectorized Episodic Memory**, and **Vision-Specific Pipelines**.

What you see: A minimalist, premium UI that handles your most complex multimodal tasks without breaking a sweat.

---

## 🛠️ How It Works

AIra operates on a **Decentralized Reasoning** pattern. Instead of one model doing everything poorly, AIra orchestrates a squad of specialists.

### 1. Unified Intelligence Intake
Whether it's a **PDF Research Paper**, a **Complex Source File**, or a **Visual Screenshot**, AIra ingests it into a local vectorized store (**ChromaDB**). 
- **Context Preservation**: No "forgetting" what happened 50 messages ago.
- **Spec-Driven**: Every response is verified against your project constraints.

### 2. Multi-Model Agentic Routing
AIra analyzes your intent and routes to the best-in-class local model:
| Task Category | Primary Model | Why? |
| :--- | :--- | :--- |
| **Simple Chat** | `llama3.2:1b` | Sub-second latency for lightweight UX. |
| **Complex Logic** | `gemma3:4b` | Deep reasoning, spec-compliance & RAG accuracy. |
| **Vision/Images** | `moondream:latest` | Dedicated vision weights for perfect descriptive analysis. |

### 3. Neural Episodic Memory
Every session is an isolated **Episodic Frame**. 
- **View History**: Instant load of past states.
- **Rename/Delete**: Clean management of your intellectual workstreams.
- **Memory Recap**: One-click summary of what the system knows about your world.

---

## 🌊 The Workflow

### 🚀 Initialize
Initialize the system with one click. AIra performs a hardware check, connects to your local Ollama instance, and prepares the VectorStore.

### 📎 Attach & Index
Drop a PDF, a Docx, or a JS file.
- **Parser wave 1**: Text extraction & cleaning.
- **Parser wave 2**: Semantic chunking.
- **Parser wave 3**: Vector embedding into ChromaDB.

### 🖼️ Vision Analysis
Upload an image. AIra displays a **Real-time Preview** and primes the Vision Engine. 
Ask "What is this?" and see the transition from Llama to Moondream happen behind a seamless UI.

---

## 💻 Tech Stack (The "Senior Eng" Choices)

- **Frontend Engine**: Pure Vanilla JS/CSS for zero-overhead performance. **GSAP** for cinematic motion; **Marked.js** for flavored markdown.
- **Communication Layer**: **Socket.io** handles the real-time token streaming and agent-thinking states.
- **RAG Tier**: **ChromaDB** + **Multer** + **PDF-Parse**. We don't just "read" files; we architect searchable knowledge.
- **Backend Infrastructure**: Express.js with **Helmet** and **Rate-Limiting** for enterprise-grade security.

---

## 📜 Key Commands & Controls

| Feature | Action | Description |
| :--- | :--- | :--- |
| **New Chat +** | `UI Button` | Wipes current context, initializes fresh Session UUID. |
| **📎 Attach** | `File Input` | Triggers RAG pipeline & Vision priming. |
| **✏️ Rename** | `Sidebar` | Update session metadata in Episodic Memory. |
| **🗑️ Delete** | `Sidebar` | Permanent atomic wipe of session & associated data. |
| **🎤 Voice** | `Mic btn` | Web Speech API integration for hands-on multimodal use. |

---

## 🛡️ Getting Started (The Senior Path)

### 1. Prerequisites
- **Node.js**: v18+
- **Ollama**: Local instance running.
- **Model Pull**: 
  ```bash
  ollama pull llama3.2:1b
  ollama pull moondream:latest
  ollama pull gemma3:4b
  ```

### 2. Configure
Create a `.env` file (Refer to `.env.example`):
```env
PORT=3001
OLLAMA_BASE_URL=http://localhost:11434
DATA_DIR=./data
```

### 3. Deploy
```bash
npm install --legacy-peer-deps
npm run dev
```

---

## 👨‍💻 Author
**Pranav** — Senior Systems Architect & UI Lead.

---
*"Build cool shit. Consistently. Using AIra."*
