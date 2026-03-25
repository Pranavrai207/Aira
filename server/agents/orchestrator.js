const { planTask } = require('./planner');
const { executeStep } = require('./executor');
const ollama = require('../llm/ollama');

class Orchestrator {
  constructor() {
    this.tools = ['web_search', 'web_scrape', 'execute_code', 'create_file', 'read_file'];
  }

  async handleTask(taskDescription, socket) {
    socket.emit('agent:thinking', { step: 'Planning task...' });
    const plan = await planTask(taskDescription, this.tools);
    
    let context = [];
    for (const step of plan) {
      socket.emit('agent:thinking', { step: `Executing ${step.tool}...` });
      try {
        const result = await executeStep(step);
        context.push({ step: step.step, tool: step.tool, result });
        socket.emit('tool:result', { tool: step.tool, result });
      } catch (error) {
        socket.emit('tool:result', { tool: step.tool, error: error.message });
        break; // Stop on error
      }
    }

    socket.emit('agent:thinking', { step: 'Summarizing results...' });
    const finalPrompt = `Task: ${taskDescription}\nResults: ${JSON.stringify(context)}\nPlease provide a final summary to the user.`;
    const response = await ollama.generate('llama3.2:1b', finalPrompt);
    
    socket.emit('chat:done', { fullText: response.response });
    return response.response;
  }
}

module.exports = new Orchestrator();
