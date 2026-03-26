const socket = io();

socket.on('connect', () => {
    console.log('Connected to Aira server');
    updateStatus('Online');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Aira server');
    updateStatus('Offline');
});

socket.on('chat:done', ({ fullText }) => {
    console.log('Message complete');
});

function updateStatus(status) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    if (status === 'Online') {
        dot.style.background = '#00f5ff';
        text.innerText = 'System Online';
    } else {
        dot.style.background = '#ff4b4b';
        text.innerText = 'System Offline';
    }
}

function updateCurrentTool(toolName) {
    const toolEl = document.getElementById('current-tool');
    if (!toolEl) return;
    
    toolEl.innerText = toolName;
    if (toolName.includes('...') || toolName.includes('Working')) {
        toolEl.classList.add('thinking-glow');
    } else {
        toolEl.classList.remove('thinking-glow');
    }
}
