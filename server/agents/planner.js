const ollama = require('../llm/ollama');

async function planTask(taskDescription, availableTools) {
  const prompt = `You are the Planner for AIra.
Task: ${taskDescription}
Available Tools: ${availableTools.join(', ')}

Break this task down into a sequence of steps. Each step should specify which tool to use and why.
Return the plan as a JSON array of objects: [{ "step": 1, "tool": "tool_name", "args": "arguments", "reason": "why" }]
`;

  try {
    const response = await ollama.generate('llama3.2:1b', prompt, { format: 'json' });
    return JSON.parse(response.response);
  } catch (error) {
    console.error('Project planning error:', error.message);
    return [{ step: 1, tool: 'chat', args: taskDescription, reason: 'Fallback to direct chat' }];
  }
}

module.exports = { planTask };
