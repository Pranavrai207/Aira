const ollama = require('../llm/ollama');

async function reflect(task, result) {
  const prompt = `You are AIra's Reflector.
Task: ${task}
Result: ${JSON.stringify(result)}

Evaluate the result against the task. Was the task completed successfully?
If not, suggest what needs to be changed for a better outcome.
Return your reflection as a short summary.
`;

  try {
    const response = await ollama.generate('llama3.2:1b', prompt);
    return response.response;
  } catch (error) {
    console.error('Reflection error:', error.message);
    return "Task completed.";
  }
}

module.exports = { reflect };
