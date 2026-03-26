const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const sessionList = document.getElementById('session-list');
const searchInput = document.getElementById('search-chats');
const settingsBtn = document.getElementById('settings-btn');
const settingsView = document.getElementById('settings-view');
const chatPanel = document.getElementById('chat-panel');
const closeSettingsViewBtn = document.getElementById('close-settings-view');
const saveSettingsViewBtn = document.getElementById('save-settings-view');

let currentSessionId = 'session-' + Date.now();
let allSessions = [];

// Initial load
loadSessions();

// Search Implementation
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderSessionList(allSessions.filter(s => s.title.toLowerCase().includes(term)));
});

// Settings Implementation
const savedModel = localStorage.getItem('aira-model') || 'auto';
const savedTheme = localStorage.getItem('aira-theme') || 'light';
const savedRecall = localStorage.getItem('aira-recall') !== 'false';
const savedSystemPrompt = localStorage.getItem('aira-system-prompt') || '';
const savedCustomInstructions = localStorage.getItem('aira-custom-instructions') || '';

document.getElementById('model-select').value = savedModel;
document.getElementById('theme-select').value = savedTheme;
document.getElementById('auto-recall').checked = savedRecall;
document.getElementById('system-prompt').value = savedSystemPrompt;
document.getElementById('custom-instructions').value = savedCustomInstructions;
document.body.className = `theme-${savedTheme}`;

settingsBtn.addEventListener('click', () => {
    chatPanel.classList.add('hidden');
    settingsView.classList.remove('hidden');
});

closeSettingsViewBtn.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    chatPanel.classList.remove('hidden');
});

saveSettingsViewBtn.addEventListener('click', () => {
    const model = document.getElementById('model-select').value;
    const theme = document.getElementById('theme-select').value;
    const recall = document.getElementById('auto-recall').checked;
    const systemPrompt = document.getElementById('system-prompt').value;
    const customInstructions = document.getElementById('custom-instructions').value;

    localStorage.setItem('aira-model', model);
    localStorage.setItem('aira-theme', theme);
    localStorage.setItem('aira-recall', recall);
    localStorage.setItem('aira-system-prompt', systemPrompt);
    localStorage.setItem('aira-custom-instructions', customInstructions);

    // Apply theme
    document.body.className = `theme-${theme}`;
    
    // Switch back to chat
    settingsView.classList.add('hidden');
    chatPanel.classList.remove('hidden');
    
    // Optional feedback
    console.log("Settings saved!");
});

const recallBtn = document.getElementById('recall-btn');
const recapModal = document.getElementById('recap-modal');
const closeRecapBtn = document.getElementById('close-recap');
const recapDocCount = document.getElementById('recap-doc-count');
const recapSessionCount = document.getElementById('recap-session-count');
const recapInstinctsList = document.getElementById('recap-instincts-list');

recallBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/chat/recap');
        const data = await res.json();
        
        recapDocCount.innerText = data.docCount || 0;
        recapSessionCount.innerText = data.sessionCount || 0;
        
        recapInstinctsList.innerHTML = '';
        if (data.instincts) {
            data.instincts.forEach(ins => {
                const li = document.createElement('li');
                li.innerText = ins;
                recapInstinctsList.appendChild(li);
            });
        }
        
        recapModal.classList.remove('hidden');
    } catch (e) {
        alert("Failed to load memory recap.");
    }
});

closeRecapBtn.addEventListener('click', () => recapModal.classList.add('hidden'));

newChatBtn.addEventListener('click', () => {
    currentSessionId = 'session-' + Date.now();
    chatMessages.innerHTML = '';
    searchInput.value = ''; // Reset search
    loadSessions();
});

const attachBtn = document.getElementById('attach-btn');
const fileInput = document.getElementById('file-input');

if (attachBtn) {
    attachBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files);
    if (!files.length) return;

    for (const file of files) {
        const isImage = file.type.startsWith('image/');
        if (isImage) {
            const blobUrl = URL.createObjectURL(file);
            appendMessage('user', `<img src="${blobUrl}" class="chat-image-preview"> Attached: ${file.name}`);
        } else {
            appendMessage('user', `📎 Attached: ${file.name}`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', currentSessionId);

        try {
            await fetch('/api/chat/upload', {
                method: 'POST',
                body: formData
            });
            appendMessage('aira', `I've analyzed **${file.name}**. I'm now ready to use its context for your complex queries. 🧠`);
        } catch (e) {
            appendMessage('aira', `Failed to upload ${file.name}.`);
        }
    }
});

async function loadSessions() {
    try {
        const res = await fetch('/api/chat/sessions');
        allSessions = await res.json();
        renderSessionList(allSessions);
    } catch (e) { console.error("History load error", e); }
}

function renderSessionList(sessions) {
    sessionList.innerHTML = '';
    sessions.slice().reverse().forEach(s => {
        const item = document.createElement('div');
        item.className = `history-item ${s.id === currentSessionId ? 'active' : ''}`;
        item.innerHTML = `
            <span class="session-title">${s.title}</span>
            <div class="history-actions">
                <button class="history-btn edit-chat" onclick="editSession('${s.id}', event)" title="Rename">✏️</button>
                <button class="history-btn delete-chat" onclick="deleteSession('${s.id}', event)" title="Delete">🗑️</button>
            </div>
        `;
        item.onclick = () => switchSession(s.id);
        sessionList.appendChild(item);
    });
}

async function switchSession(id) {
    currentSessionId = id;
    chatMessages.innerHTML = '<div class="status-msg">Loading history...</div>';
    try {
        const res = await fetch(`/api/chat/sessions/${id}`);
        const data = await res.json();
        chatMessages.innerHTML = '';
        if (data.messages) {
            data.messages.forEach(m => {
                if (m.role !== 'system') appendMessage(m.role, m.content);
            });
        }
        renderSessionList(allSessions); // Update active class
    } catch (e) { 
        console.error(e);
        appendMessage('aira', 'Could not load chat history.'); 
    }
}

window.deleteSession = async (id, e) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
        await fetch(`/api/chat/sessions/${id}`, { method: 'DELETE' });
        if (id === currentSessionId) {
            chatMessages.innerHTML = '';
            currentSessionId = 'session-' + Date.now();
        }
        loadSessions();
    }
};

window.editSession = async (id, e) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
        await fetch(`/api/chat/sessions/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });
        loadSessions();
    }
};

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

micBtn.addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };
    } else {
        alert("Speech recognition not supported in this browser.");
    }
});

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    // Choose model from settings
    const model = localStorage.getItem('aira-model') || 'auto';

    // Show initial thinking state
    updateCurrentTool('Aira: Processing...');

    // Transmit custom instructions if present
    const systemPrompt = localStorage.getItem('aira-system-prompt') || '';
    const customInstructions = localStorage.getItem('aira-custom-instructions') || '';

    // Emit message via Socket
    socket.emit('chat:message', { 
        text, 
        sessionId: currentSessionId,
        model: model,
        systemPrompt: systemPrompt,
        customInstructions: customInstructions
    });
}

// Add these listeners for Socket interaction
socket.on('chat:token', ({ token }) => {
    appendToLastMessage(token);
    updateCurrentTool('Aira: Thinking...'); // Reset status if we were showing a specific tool
});

socket.on('chat:done', ({ fullText }) => {
    updateCurrentTool('Aira: Ready');
    loadSessions(); // Update titles/history
});

socket.on('agent:thinking', ({ step }) => {
    updateCurrentTool(step);
});

socket.on('chat:error', ({ error }) => {
    appendMessage('aira', `⚠️ Error: ${error}`);
    updateCurrentTool('Aira: Error');
});

function appendToLastMessage(token) {
    let lastMsg = chatMessages.lastElementChild;
    if (!lastMsg || !lastMsg.classList.contains('aira')) {
        appendMessage('aira', '');
        lastMsg = chatMessages.lastElementChild;
    }
    const contentDiv = lastMsg.querySelector('.message-content');
    
    // We store raw response in a data attribute to re-parse with marked
    const currentRaw = lastMsg.getAttribute('data-raw') || '';
    const newRaw = currentRaw + token;
    lastMsg.setAttribute('data-raw', newRaw);
    
    contentDiv.innerHTML = marked.parse(newRaw);
    contentDiv.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(role, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role} slide-in`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user' ? 'P' : 'A'; 

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (role === 'aira' || role === 'assistant') {
        msgDiv.setAttribute('data-raw', content);
        contentDiv.innerHTML = marked.parse(content);
        contentDiv.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    } else {
        if (content.includes('<img')) {
            contentDiv.innerHTML = content;
        } else {
            contentDiv.innerText = content;
        }
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
