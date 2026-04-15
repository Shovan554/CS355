const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();
const server = http.createServer(app);

// ── Socket.io ──────────────────────────────────────────────
const io = new Server(server);

// ── PeerJS Server ──────────────────────────────────────────
// Mount PeerJS at /peerjs so it doesn't clash with your routes
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',          // internal path inside the peerjs mount
});
app.use('/peerjs', peerServer);

// ── Static files ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ─────────────────────────────────────────────────

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Room page  — any /:roomId goes here
app.get('/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// ── Socket.io Room Logic ────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // Client tells us which room + what their PeerJS ID is
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    console.log(`[room] ${peerId} joined room ${roomId}`);

    // Tell everyone ELSE in the room that a new peer arrived
    socket.to(roomId).emit('user-connected', peerId);

    // When this socket disconnects, tell the room
    socket.on('disconnect', () => {
      console.log(`[room] ${peerId} left room ${roomId}`);
      socket.to(roomId).emit('user-disconnected', peerId);
    });
  });
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
