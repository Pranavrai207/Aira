const { planTask } = require('./planner');
const { executeStep } = require('./executor');
const ollama = require('../llm/ollama');
const vectorStore = require('../memory/vectorStore');
const memory = require('../memory/episodic');
const { selectModel } = require('../llm/modelRouter');
const { getInstincts } = require('../memory/instincts');

class Orchestrator {
  constructor() {
    this.tools = ['web_search', 'web_scrape', 'execute_code', 'create_file', 'read_file'];
  }

  async handleTask(taskDescription, sessionId, socket, preferredModel = 'auto', customSystemPrompt = '', customInstructions = '') {
    await memory.init();
    
    // 1. Memory Recall (RAG)
    socket.emit('agent:thinking', { step: 'Recalling relevant context...' });
    const memoryResults = await vectorStore.query(taskDescription, 5);
    const relatedDocs = memoryResults.documents[0] || [];
    const contextString = relatedDocs.length > 0 ? `\n\nContext from files:\n${relatedDocs.join('\n')}` : '';

    // 2. Planning (Only for complex tasks)
    const isComplex = taskDescription.length > 100 || /search|find|scrape|run|code|calculate|file|price|news|weather|today's|how many/i.test(taskDescription);
    let context = [];
    
    if (isComplex) {
      socket.emit('agent:thinking', { step: 'Architecting a solution...' });
      const planResponse = await planTask(taskDescription, this.tools);
      const plan = Array.isArray(planResponse) ? planResponse : (planResponse.plan || []);
      
      for (const step of plan) {
        if (step.tool === 'chat' || step.tool === 'none') continue;
        
        socket.emit('agent:thinking', { step: `Working: ${step.tool}...` });
        try {
          const result = await executeStep(step);
          context.push({ step: step.step, tool: step.tool, result: JSON.stringify(result) });
          socket.emit('tool:result', { tool: step.tool, result });
        } catch (error) {
          socket.emit('tool:result', { tool: step.tool, error: error.message });
        }
      }
    }

    // 3. Model Selection
    let model = preferredModel === 'auto' ? selectModel({ text: taskDescription, complexity: isComplex ? 0.8 : 0.3 }) : preferredModel;

    // 4. Final Reasoning & Streaming
    socket.emit('agent:thinking', { step: 'Synthesizing final response...' });
    
    const session = await memory.getSession(sessionId);
    const history = (session ? session.messages : []).filter(m => m.role !== 'system');
    const instincts = getInstincts().join('\n- ');
    
    const baseSystemPrompt = customSystemPrompt || `You are Aira, a premium AI assistant.`;
    const systemPrompt = `${baseSystemPrompt}
Context from RAG: ${contextString}
Tool Results: ${JSON.stringify(context)}
Instincts:
- ${instincts}
${customInstructions ? `\nCustom User Instructions:\n${customInstructions}` : ''}

Be extremely concise. If the user asks for a specific fact (like a price), provide the answer in ONE LINE only. Do not apologize or explain.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: taskDescription }
    ];

    let fullResponse = '';
    try {
      const responseStream = ollama.chat(model, messages, { stream: true });
      
      for await (const part of responseStream) {
        if (part.message && part.message.content) {
          fullResponse += part.message.content;
          socket.emit('chat:token', { token: part.message.content });
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      socket.emit('chat:error', { error: "Failed to generate response." });
      return;
    }

    // 5. Save History
    const updatedHistory = [
      ...history,
      { role: 'user', content: taskDescription },
      { role: 'assistant', content: fullResponse }
    ];
    await memory.saveSession(sessionId, updatedHistory);

    // 6. Auto-title
    if (updatedHistory.filter(m => m.role === 'user').length === 1) {
        const titleSnippet = taskDescription.slice(0, 30) + (taskDescription.length > 30 ? '...' : '');
        await memory.updateSessionTitle(sessionId, titleSnippet);
    }

    socket.emit('chat:done', { fullText: fullResponse });
    return fullResponse;
  }
}

module.exports = new Orchestrator();
