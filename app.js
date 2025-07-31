const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5500', 'http://localhost:3001', 'http://localhost:3000'], // Allow all local ports
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const PORT = process.env.PORT || 3001;

// ✅ CORs configuration
app.use(cors({
  origin: ['http://localhost:5500', 'http://localhost:3001', 'http://localhost:3000'],
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve frontend pages
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

// Add a route to check authentication status
app.get('/api/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

// ✅ Routes
app.use(authRoutes);
app.use(messageRoutes);

// ✅ Error handling middleware (must be last)
app.use(errorHandler);

// ✅ Socket.IO handling
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Join group (room)
  socket.on('join-group', (groupId) => {
    const roomName = `group-${groupId}`;
    socket.join(roomName);
    console.log(`✅ Socket ${socket.id} joined ${roomName}`);
  });

  // Leave group
  socket.on('leave-group', (groupId) => {
    const roomName = `group-${groupId}`;
    socket.leave(roomName);
    console.log(`🚪 Socket ${socket.id} left ${roomName}`);
  });

  // Handle message sending within group
  socket.on('send-message', (msg) => {
    const roomName = `group-${msg.groupId}`;
    console.log(`📩 Message to ${roomName}:`, msg);
    socket.to(roomName).emit('receive-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// ✅ Sync DB and start server
sequelize.sync()
  .then(() => {
    console.log('✅ Database synchronized successfully.');
    server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
    process.exit(1);
  });
