const axios = require('axios');

class OllamaClient {
  constructor(baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async generate(model, prompt, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model,
        prompt,
        stream: false,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Ollama generate error:', error.message);
      throw error;
    }
  }

  async *chat(model, messages, options = {}) {
    const { stream = false, ...otherOptions } = options;
    try {
      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        model,
        messages,
        stream,
        ...otherOptions
      }, { responseType: stream ? 'stream' : 'json' });

      if (stream) {
        for await (const chunk of response.data) {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              yield JSON.parse(line);
            } catch (e) {
              console.warn("Failed to parse Ollama chunk:", line);
            }
          }
        }
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Ollama chat error:', error.message);
      throw error;
    }
  }

  async embed(model, input) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/embeddings`, {
        model,
        prompt: input
      });
      return response.data.embedding;
    } catch (error) {
      console.error('Ollama embedding error:', error.message);
      throw error;
    }
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data;
    } catch (error) {
      console.error('Ollama list error:', error.message);
      throw error;
    }
  }
}

module.exports = new OllamaClient();
