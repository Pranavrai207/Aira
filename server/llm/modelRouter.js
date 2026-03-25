/**
 * Model Router Logic
 * Automatically selects the right Ollama model based on task type.
 */

function selectModel(task) {
  // Vision tasks
  if (task.hasImage || task.type === 'vision') {
    return 'moondream:latest';
  }

  // Complex coding/reasoning
  if (task.type === 'code' || task.type === 'complex' || (task.complexity && task.complexity > 0.7)) {
    return 'gemma3:4b';
  }

  // Quick chat, simple Q&A, formatting
  if (task.type === 'quick' || task.type === 'simple') {
    return 'llama3.2:1b';
  }

  // Default fast model
  return 'llama3.2:1b';
}

module.exports = { selectModel };
