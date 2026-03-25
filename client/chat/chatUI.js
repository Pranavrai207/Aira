const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const sessionList = document.getElementById('session-list');

let currentSessionId = 'session-' + Date.now();

// Initial load
loadSessions();

const attachBtn = document.getElementById('attach-btn');
const fileInput = document.getElementById('file-input');

if (attachBtn) {
    attachBtn.addEventListener('click', () => {
        console.log("Attachment button clicked");
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
            const res = await fetch('/api/chat/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            appendMessage('aira', `I've analyzed **${file.name}**. I'm now ready to use its context for your complex queries. 🧠`);
        } catch (e) {
            appendMessage('aira', `Failed to upload ${file.name}.`);
        }
    }
});

async function loadSessions() {
    try {
        const res = await fetch('/api/chat/sessions');
        const sessions = await res.json();
        sessionList.innerHTML = '';
        sessions.reverse().forEach(s => {
            const item = document.createElement('div');
            item.className = `history-item ${s.id === currentSessionId ? 'active' : ''}`;
            item.innerHTML = `
                <span class="session-title">${s.title}</span>
                <div class="history-actions">
                    <button class="history-btn delete-chat" onclick="deleteSession('${s.id}', event)">🗑️</button>
                    <button class="history-btn edit-chat" onclick="editSession('${s.id}', event)">✏️</button>
                </div>
            `;
            item.onclick = () => switchSession(s.id);
            sessionList.appendChild(item);
        });
    } catch (e) { console.error("History load error", e); }
}

async function switchSession(id) {
    currentSessionId = id;
    chatMessages.innerHTML = '<div class="status-msg">Loading history...</div>';
    try {
        const res = await fetch(`/api/chat/sessions/${id}`);
        const data = await res.json();
        chatMessages.innerHTML = '';
        data.messages.forEach(m => appendMessage(m.role, m.content));
        loadSessions(); // Update active class
    } catch (e) { appendMessage('aira', 'Could not load chat history.'); }
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

// Speech to Text (Restored)
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

// Update sendMessage to reload history after first message
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
        loadSessions(); // Refresh to catch first-message title or update timestamp
    } catch (error) {
        appendMessage('aira', 'An error occurred. Check the server.');
    }
}

function appendMessage(role, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user' ? 'P' : 'A'; // Pranav / AIra

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (role === 'aira') {
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
