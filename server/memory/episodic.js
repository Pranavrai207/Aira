const fs = require('fs-extra');
const path = require('path');

/**
 * Episodic Memory - Simple JSON-based persistence using fs-extra.
 * (Alternative to lowdb if ESM/CJS issues arise)
 */
class EpisodicMemory {
  constructor() {
    this.filePath = path.resolve(process.env.DATA_DIR || './data', 'memory.json');
    this.data = { sessions: [], preferences: {} };
  }

  async init() {
    try {
      if (await fs.exists(this.filePath)) {
        this.data = await fs.readJson(this.filePath);
      } else {
        await fs.writeJson(this.filePath, this.data);
      }
    } catch (error) {
      console.error('EpisodicMemory init error:', error.message);
    }
  }

  async saveSession(sessionId, messages) {
    const sessionIndex = this.data.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex > -1) {
      this.data.sessions[sessionIndex].messages = messages;
      this.data.sessions[sessionIndex].lastUpdated = new Date().toISOString();
    } else {
      this.data.sessions.push({
        id: sessionId,
        messages,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
    await this.save();
  }

  async getSessions() {
    return this.data.sessions.map(s => ({ 
      id: s.id, 
      title: s.title || (s.messages[0]?.content.slice(0, 30) + '...') || 'New Chat',
      lastUpdated: s.lastUpdated 
    }));
  }

  async getSession(sessionId) {
    return this.data.sessions.find(s => s.id === sessionId);
  }

  async deleteSession(sessionId) {
    this.data.sessions = this.data.sessions.filter(s => s.id !== sessionId);
    await this.save();
  }

  async updateSessionTitle(sessionId, title) {
    const session = this.data.sessions.find(s => s.id === sessionId);
    if (session) {
      session.title = title;
      await this.save();
    }
  }

  async updatePreference(key, value) {
    this.data.preferences[key] = value;
    await this.save();
  }

  async save() {
    await fs.writeJson(this.filePath, this.data, { spaces: 2 });
  }
}

module.exports = new EpisodicMemory();
