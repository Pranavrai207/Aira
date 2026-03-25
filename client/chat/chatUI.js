const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const sessionList = document.getElementById('session-list');
const searchInput = document.getElementById('search-chats');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');

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

document.getElementById('model-select').value = savedModel;
document.getElementById('theme-select').value = savedTheme;
document.getElementById('auto-recall').checked = savedRecall;
document.body.className = `theme-${savedTheme}`;

settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

saveSettingsBtn.addEventListener('click', () => {
    const model = document.getElementById('model-select').value;
    const theme = document.getElementById('theme-select').value;
    const recall = document.getElementById('auto-recall').checked;

    localStorage.setItem('aira-model', model);
    localStorage.setItem('aira-theme', theme);
    localStorage.setItem('aira-recall', recall);

    // Apply theme (basic implementation)
    document.body.className = `theme-${theme}`;
    
    alert("Settings saved!");
    settingsModal.classList.add('hidden');
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

    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sessionId: currentSessionId })
        });
        const data = await response.json();
        appendMessage('aira', data.content);
        loadSessions();
    } catch (error) {
        appendMessage('aira', 'An error occurred. Check the server.');
    }
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
