# AIra — Advanced AI Agent System

AIra is a local-first, privacy-respecting, intelligent assistant powered by Ollama local models. 
It features autonomous task execution, memory-driven reasoning, multi-modal web intelligence, and safe shell-level code operations.

## 🚀 Setup

1.  **Ollama**: Install [Ollama](https://ollama.com/) and download the models:
    ```bash
    ollama run llama3.2:1b
    ollama run gemma3:4b
    ollama run moondream:latest
    ollama run nomic-embed-text:latest
    ```
2.  **ChromaDB**: Install via pip and run:
    ```bash
    pip install chromadb
    chroma run --path ./data/chroma
    ```
3.  **Redis**: Install Redis for Windows (or via WSL/Docker).
4.  **Install Dependencies**:
    ```bash
    npm install
    npx playwright install chromium
    ```
5.  **Run**:
    ```bash
    npm run dev
    ```

## 📂 Folder Structure

- `server/`: Backend Express server.
- `client/`: Frontend 3D/Chat UI.
- `aira-workspace/`: AIra's sandboxed work directory.
- `data/`: Persistent storage for memory.
