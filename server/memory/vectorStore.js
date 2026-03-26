const { ChromaClient } = require('chromadb');
const ollama = require('../llm/ollama');

class VectorStore {
  constructor() {
    this.client = new ChromaClient({
      path: process.env.CHROMA_URL || 'http://localhost:8000'
    });
    this.collectionName = 'aira_memory';
    this.collection = null;
  }

  async init() {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
        metadata: { "hnsw:space": "cosine" }
      });
      console.log(`ChromaDB collection '${this.collectionName}' initialized.`);
    } catch (error) {
      console.error('ChromaDB init error:', error.message);
      // Fallback or warning
    }
  }

  async addDocument(id, text, metadata = {}) {
    if (!this.collection) await this.init();
    if (!this.collection) return; // Silent skip if still null
    try {
      const embedding = await ollama.embed('nomic-embed-text:latest', text);
      await this.collection.add({
        ids: [id],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [text]
      });
    } catch (error) {
      console.error('VectorStore add error:', error.message);
    }
  }

  async query(text, nResults = 5) {
    if (!this.collection) await this.init();
    if (!this.collection) return { documents: [[]], metadatas: [[]] };
    try {
      const embedding = await ollama.embed('nomic-embed-text:latest', text);
      const results = await this.collection.query({
        queryEmbeddings: [embedding],
        nResults
      });
      return results;
    } catch (error) {
      console.error('VectorStore query error:', error.message);
      return { documents: [[]], metadatas: [[]] };
    }
  }
  async count() {
    if (!this.collection) await this.init();
    if (!this.collection) return 0;
    try {
      return await this.collection.count();
    } catch (e) {
      console.error('VectorStore count error:', e.message);
      return 0;
    }
  }
}

module.exports = new VectorStore();
