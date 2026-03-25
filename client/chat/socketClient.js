const socket = io();

socket.on('connect', () => {
    console.log('Connected to Aira server');
    updateStatus('Online');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Aira server');
    updateStatus('Offline');
});

socket.on('chat:token', ({ token }) => {
    appendToLastMessage(token);
});

socket.on('chat:done', ({ fullText }) => {
    console.log('Message complete');
});

socket.on('agent:thinking', ({ step }) => {
    updateCurrentTool(step);
});

socket.on('tool:result', ({ tool, result }) => {
    console.log(`Tool ${tool} finished:`, result);
});

function updateStatus(status) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (status === 'Online') {
        dot.style.background = '#00f5ff';
        text.innerText = 'System Online';
    } else {
        dot.style.background = '#ff4b4b';
        text.innerText = 'System Offline';
    }
}

function updateCurrentTool(toolName) {
    document.getElementById('current-tool').innerText = toolName;
}
