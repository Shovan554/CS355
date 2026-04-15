# Lab 9 — Backend Guide: Video Conferencing with Express + Socket.io + PeerJS

## Overview

This backend acts as the **signaling server** for a peer-to-peer video conferencing app.

- **Express** serves the frontend static files
- **PeerJS Server** brokers WebRTC peer connections (gives every browser a unique Peer ID)
- **Socket.io** handles room logic: who joined, who left, and broadcasting peer IDs to other participants

---

## Project Structure

```
lab9/
├── server.js          ← main entry point
├── public/
│   ├── index.html     ← landing page (create/join meeting)
│   └── room.html      ← the actual video call room
├── package.json
└── backend.md         ← this file
```

---

## Step 1 — Initialize the Project

```bash
mkdir lab9 && cd lab9
npm init -y
npm install express socket.io peer
```

`http` is built into Node — **do not** install it separately.

---

## Step 2 — `server.js`

```js
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
```

### What each part does

| Part | Responsibility |
|------|---------------|
| `http.createServer(app)` | Shares one TCP server between Express and Socket.io |
| `ExpressPeerServer` | Manages PeerJS IDs and relays ICE candidates |
| `socket.on('join-room')` | Receives `(roomId, peerId)` from the client |
| `socket.to(roomId).emit('user-connected', peerId)` | Broadcasts the new peer's ID to all **other** sockets in the room |
| `socket.on('disconnect')` | Cleans up — notifies the room a peer left |

---

## Step 3 — Room ID Generation

Room IDs are generated **on the frontend** using `crypto.randomUUID()` and passed as the URL path (e.g. `/3f2a...`). The backend treats any path as a valid room — no registration needed.

---

## Step 4 — Run It

```bash
node server.js
```

Then open:
- `http://localhost:3000` → landing page (create or join meeting)
- `http://localhost:3000/<roomId>` → video room

---

## Key Data Flow

```
Browser A                    Server                      Browser B
   │                           │                             │
   │── join-room(roomId, pidA) →│                             │
   │                           │←── join-room(roomId, pidB) ──│
   │                           │                             │
   │←── user-connected(pidB) ──│                             │
   │                           │                             │
   │  [A calls B via PeerJS WebRTC — no server relay] ───────│
   │◄══════════════════ video/audio stream ══════════════════►│
```

Socket.io only carries **signals** (who is in the room). The actual media streams go **directly peer-to-peer** via WebRTC, brokered by the PeerJS server.

---

## Common Gotchas

| Issue | Fix |
|-------|-----|
| `peer` not found | Make sure you ran `npm install peer` (not `peerjs`) |
| Port conflict | Change `PORT` env var or kill whatever is on 3000 |
| CORS errors in dev | Socket.io and PeerJS are both on the same origin — no CORS config needed for local dev |
| PeerJS path confusion | Client must point to `host: localhost, port: 3000, path: '/peerjs'` |

---

## Environment Variables (optional)

```bash
PORT=3000   # default
```

No `.env` needed for the lab — just `node server.js`.
