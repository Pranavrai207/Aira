const axios = require('axios');

class OllamaClient {
  constructor(
    primaryHost = process.env.OLLAMA_BASE_URL || 'https://ollama.com', 
    apiKey = process.env.OLLAMA_API_KEY,
    fallbackHost = process.env.LOCAL_OLLAMA_URL || 'http://localhost:11434'
  ) {
    this.primaryHost = primaryHost;
    this.fallbackHost = fallbackHost;
    this.apiKey = apiKey;
  }

  async generate(model, prompt, options = {}) {
    try {
      return await this._request('generate', { model, prompt, stream: false, ...options });
    } catch (error) {
      console.warn(`Primary host failed, trying fallback: ${error.message}`);
      // Fallback model mapping
      const localModel = model.includes('671b') ? 'gemma3:4b' : 'llama3.2:1b';
      return await this._request('generate', { model: localModel, prompt, stream: false, ...options }, true);
    }
  }

  async *chat(model, messages, options = {}) {
    const { stream = false } = options;
    try {
      const result = await this._chatRequest(model, messages, options);
      if (stream) yield* result;
      else return result;
    } catch (error) {
      console.warn(`Cloud chat failed, falling back to local: ${error.message}`);
      // Map to a reliable local model for fallback
      const localModel = (model.includes('671b') || model.includes('12b')) ? 'gemma3:4b' : 'llama3.2:1b';
      const result = await this._chatRequest(localModel, messages, options, true);
      if (stream) yield* result;
      else return result;
    }
  }

  async _request(endpoint, data, useFallback = false) {
    const host = useFallback ? this.fallbackHost : this.primaryHost;
    const headers = (!useFallback && this.apiKey) ? { 'Authorization': `Bearer ${this.apiKey}` } : {};
    
    const response = await axios.post(`${host}/api/${endpoint}`, data, { headers });
    return response.data;
  }

  async _chatRequest(model, messages, options, useFallback = false) {
    const { stream = false, ...otherOptions } = options;
    const host = useFallback ? this.fallbackHost : this.primaryHost;
    const headers = (!useFallback && this.apiKey) ? { 'Authorization': `Bearer ${this.apiKey}` } : {};

    const response = await axios.post(`${host}/api/chat`, {
      model,
      messages,
      stream,
      ...otherOptions
    }, { 
      responseType: stream ? 'stream' : 'json',
      headers 
    });

    if (stream) {
      return this._streamGenerator(response.data);
    } else {
      return response.data;
    }
  }

  async *_streamGenerator(stream) {
    for await (const chunk of stream) {
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
  }

  async embed(model, input) {
    try {
      const response = await axios.post(`${this.primaryHost}/api/embeddings`, {
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
      const response = await axios.get(`${this.primaryHost}/api/tags`);
      return response.data;
    } catch (error) {
      console.error('Ollama list error:', error.message);
      throw error;
    }
  }
}

module.exports = new OllamaClient();
