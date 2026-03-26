/**
 * Model Router Logic
 * Automatically selects the right Ollama model based on task type.
 */

function selectModel(task) {
  const hasKey = !!process.env.OLLAMA_API_KEY;

  // Vision tasks (Local or Cloud)
  if (task.hasImage || task.type === 'vision') {
    return 'moondream:latest';
  }

  // Complex coding/reasoning
  if (task.type === 'code' || task.type === 'complex' || (task.complexity && task.complexity > 0.7)) {
    return hasKey ? 'cogito-2.1:671b' : 'gemma3:4b';
  }

  // Quick chat, simple Q&A, formatting
  if (task.type === 'quick' || task.type === 'simple') {
    return hasKey ? 'gemma3:12b' : 'llama3.2:1b';
  }

  // Default
  return hasKey ? 'gemma3:12b' : 'llama3.2:1b';
}

module.exports = { selectModel };
