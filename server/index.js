require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // For development with CDNs
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Ensure workspace and data dirs exist
const workspaceDir = path.resolve(process.env.AIRA_WORKSPACE || './aira-workspace');
const dataDir = path.resolve(process.env.DATA_DIR || './data');
fs.ensureDirSync(workspaceDir);
fs.ensureDirSync(dataDir);

// Routes
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic Route
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AIra server running on http://localhost:${PORT}`);
});
