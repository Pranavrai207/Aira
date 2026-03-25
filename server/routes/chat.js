const express = require('express');
const path = require('path');
const router = express.Router();
const ollama = require('../llm/ollama');
const { selectModel } = require('../llm/modelRouter');
const vectorStore = require('../memory/vectorStore');
const memory = require('../memory/episodic');
const { getInstincts } = require('../memory/instincts');

const multer = require('multer');
const fs = require('fs-extra');
const upload = multer({ dest: 'uploads/' });

const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// --- File Upload & RAG Integration ---
router.post('/upload', upload.single('file'), async (req, res) => {
    await memory.init();
    const { sessionId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        let content = '';
        const ext = path.extname(file.originalname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

        if (isImage) {
            // For images, we'll store the path and use it later for vision analysis
            await memory.updatePreference(`last_image_${sessionId}`, file.path);
            res.json({ message: 'Image uploaded and ready for vision analysis', type: 'image' });
            return; // Don't delete yet, we need it for the next chat
        } else if (ext === '.pdf') {
            const dataBuffer = await fs.readFile(file.path);
            const data = await pdf(dataBuffer);
            content = data.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: file.path });
            content = result.value;
        } else {
            content = await fs.readFile(file.path, 'utf8');
        }
        
        // Save to VectorStore (RAG) for text
        if (content) {
            await vectorStore.add(content, { 
                id: `file-${Date.now()}`,
                name: file.originalname,
                sessionId 
            });
        }

        await fs.remove(file.path);
        res.json({ message: 'File indexed for RAG', size: content.length });
    } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ error: 'Failed to process file: ' + e.message });
    }
});

router.post('/message', async (req, res) => {
    const { text, sessionId } = req.body;
    await memory.init();

    try {
        // 1. Vision Check
        let imageBufferBase64 = null;
        const imagePathKey = `last_image_${sessionId}`;
        const imagePath = (memory.data && memory.data.preferences) ? memory.data.preferences[imagePathKey] : null;

        // 2. Decide Model
        let model = 'llama3.2:1b';
        let images = [];
        const lowText = text.toLowerCase();
        const isVisionTask = imagePath && (lowText.includes('this') || lowText.includes('image') || lowText.includes('look') || lowText.includes('is it') || lowText.includes('what is') || lowText.includes('analyze') || lowText.includes('tell me'));

        if (isVisionTask) {
            model = 'moondream:latest';
            const imgData = await fs.readFile(imagePath);
            imageBufferBase64 = imgData.toString('base64');
            images = [imageBufferBase64];
        } else {
            const complexity = text.length > 300 || text.includes('solve') || text.includes('code') || text.includes('analyze') ? 0.8 : 0.3;
            model = selectModel({ text, complexity, type: complexity > 0.5 ? 'complex' : 'quick' });
        }

        // 3. Recall Memory (RAG)
        const memoryResults = await vectorStore.query(text, 5);
        const relatedDocs = memoryResults.documents[0] || [];

        // 4. Prepare System Prompt
        const chatInstincts = getInstincts().join('\n- ');
        const systemPrompt = `You are AIra. Analyze context precisely.`;

        // 5. Chat with Ollama
        const ollamaMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text, images }
        ];

        const response = await ollama.chat(model, ollamaMessages);

        // 6. Cleanup image path if used
        if (isVisionTask) {
           await fs.remove(imagePath);
           delete memory.data.preferences[imagePathKey];
           await memory.save();
        }

    // 5. Save to Episodic Memory (Session)
    await memory.saveSession(sessionId, [...ollamaMessages, response.message]);

    res.json({
      role: 'assistant',
      content: response.message.content,
      model: model,
      sessionId
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// --- Session History API ---
router.get('/sessions', async (req, res) => {
    const sessions = await memory.getSessions();
    res.json(sessions);
});

router.get('/sessions/:id', async (req, res) => {
    const session = await memory.getSession(req.params.id);
    if (session) res.json(session);
    else res.status(404).send('Session not found');
});

router.patch('/sessions/:id', async (req, res) => {
    const { title } = req.body;
    await memory.updateSessionTitle(req.params.id, title);
    res.status(200).send('Title updated');
});

router.delete('/sessions/:id', async (req, res) => {
    await memory.deleteSession(req.params.id);
    res.status(200).send('Session deleted');
});

module.exports = router;
