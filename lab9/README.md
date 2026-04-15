# Ping — Peer-to-Peer Video Meetings

A Zoom-like video conferencing app built with WebRTC, PeerJS, Socket.io, and Express.

## Features

- Create or join meetings with a single click
- Peer-to-peer video/audio — media never touches the server
- Copy invite link to share with participants
- Mute/unmute microphone and toggle camera
- Real-time participant join/leave notifications
- Dark glassmorphism UI with smooth animations

## Tech Stack

- **Express** — serves static files and routes
- **Socket.io** — handles room signaling (join/leave events)
- **PeerJS** — brokers WebRTC peer connections
- **WebRTC** — direct browser-to-browser video/audio streams

## Setup

```bash
cd lab9
npm install
node server.js
```

Open `http://localhost:3000` in your browser.

## Usage

1. Click **New Meeting** to create a room
2. Click **Invite** to copy the room link
3. Share the link — others paste it or open it directly
4. Use the controls to mute, toggle camera, or leave

## Project Structure

```
lab9/
├── server.js            # Express + Socket.io + PeerJS server
├── public/
│   ├── index.html       # Landing page (create/join)
│   └── room.html        # Video call room
├── package.json
├── frontend.md          # Frontend design guide
├── backend.md           # Backend implementation guide
└── README.md
```
