# Lab 9 — Frontend Guide: Modern Video Conferencing UI

## Design Direction

**Aesthetic**: Dark glassmorphism meets brutalist grid — deep space background with frosted-glass panels, sharp accent colors, and kinetic micro-interactions. Think "Mission Control for humans."

**Color Palette**
```
--bg:          #080b12      (deep navy-black)
--surface:     rgba(255,255,255,0.05)  (glass panel)
--border:      rgba(255,255,255,0.08)
--accent:      #7c6dff      (electric violet)
--accent2:     #00e5c0      (teal green)
--danger:      #ff4d6d
--text:        #f0f2ff
--muted:       #8892aa
```

**Fonts**
- Display: `Syne` (Google Fonts) — geometric, futuristic
- Body: `DM Sans` — clean, readable

---

## File: `public/index.html` — Landing Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nexus — Video Meetings</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

  <!-- Framer Motion via CDN (UMD build) -->
  <script src="https://cdn.jsdelivr.net/npm/framer-motion@11/dist/framer-motion.js"></script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080b12;
      --surface: rgba(255,255,255,0.05);
      --border: rgba(255,255,255,0.08);
      --accent: #7c6dff;
      --accent2: #00e5c0;
      --danger: #ff4d6d;
      --text: #f0f2ff;
      --muted: #8892aa;
    }

    html, body {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    /* ── Animated starfield background ── */
    #bg-canvas {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    /* Gradient orbs */
    .orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.18;
      pointer-events: none;
      z-index: 0;
    }
    .orb-1 { width: 600px; height: 600px; background: var(--accent); top: -200px; left: -150px; animation: drift 18s ease-in-out infinite alternate; }
    .orb-2 { width: 500px; height: 500px; background: var(--accent2); bottom: -150px; right: -100px; animation: drift 22s ease-in-out infinite alternate-reverse; }

    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to   { transform: translate(60px, 40px) scale(1.1); }
    }

    /* ── Layout ── */
    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    /* ── Logo / wordmark ── */
    .logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(2.8rem, 6vw, 4.5rem);
      letter-spacing: -2px;
      background: linear-gradient(135deg, var(--text) 40%, var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.4rem;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
    }

    .tagline {
      font-size: 1rem;
      color: var(--muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 3.5rem;
      opacity: 0;
      animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s forwards;
    }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2.5rem 2.8rem;
      width: min(440px, 94vw);
      opacity: 0;
      animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
    }

    .card-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.6rem;
      color: var(--text);
    }

    /* ── Buttons ── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.85rem 1.5rem;
      border-radius: 12px;
      border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      text-decoration: none;
    }
    .btn:active { transform: scale(0.97); }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #5a4ed4);
      color: #fff;
      box-shadow: 0 4px 24px rgba(124,109,255,0.35);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 32px rgba(124,109,255,0.55);
      transform: translateY(-1px);
    }

    .btn-ghost {
      background: rgba(255,255,255,0.06);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover {
      background: rgba(255,255,255,0.10);
      border-color: rgba(255,255,255,0.18);
    }

    /* ── Divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.4rem 0;
      color: var(--muted);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* ── Input ── */
    .input-wrap { position: relative; }
    .input-wrap input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.8rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-wrap input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(124,109,255,0.18);
    }
    .input-wrap input::placeholder { color: var(--muted); }
    .input-icon {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      font-size: 1rem;
      pointer-events: none;
    }

    /* ── Row ── */
    .row { display: flex; gap: 0.75rem; margin-top: 0.75rem; }
    .row .btn { flex: 1; }

    /* ── Animations ── */
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Toast ── */
    #toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: rgba(0,229,192,0.15);
      border: 1px solid rgba(0,229,192,0.3);
      color: var(--accent2);
      padding: 0.65rem 1.4rem;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
      opacity: 0;
      z-index: 999;
      white-space: nowrap;
    }
    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  </style>
</head>
<body>

  <!-- Background orbs -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <div class="page">
    <div class="logo">Nexus</div>
    <p class="tagline">Peer-to-peer video meetings</p>

    <div class="card">
      <p class="card-title">Start or join a meeting</p>

      <!-- Create -->
      <button class="btn btn-primary" id="createBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Meeting
      </button>

      <div class="divider">or join existing</div>

      <!-- Join -->
      <div class="input-wrap">
        <span class="input-icon">🔗</span>
        <input type="text" id="roomInput" placeholder="Paste room ID or link…"/>
      </div>
      <div class="row">
        <button class="btn btn-ghost" id="joinBtn">Join Room</button>
      </div>
    </div>
  </div>

  <div id="toast"></div>

  <script>
    // ── Create meeting ──────────────────────────────────────
    document.getElementById('createBtn').addEventListener('click', () => {
      const roomId = crypto.randomUUID();
      window.location.href = `/${roomId}`;
    });

    // ── Join meeting ────────────────────────────────────────
    document.getElementById('joinBtn').addEventListener('click', () => {
      const raw = document.getElementById('roomInput').value.trim();
      if (!raw) { showToast('⚠ Please enter a room ID or link'); return; }

      // Accept full URL or bare UUID
      let roomId = raw;
      try {
        const url = new URL(raw);
        roomId = url.pathname.replace(/^\//, '');
      } catch {}

      if (!roomId) { showToast('⚠ Invalid room link'); return; }
      window.location.href = `/${roomId}`;
    });

    // Also allow Enter key in input
    document.getElementById('roomInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('joinBtn').click();
    });

    // ── Toast helper ────────────────────────────────────────
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2800);
    }
  </script>
</body>
</html>
```

---

## File: `public/room.html` — Video Call Room

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nexus — Meeting</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

  <!-- Socket.io (served by your Express server automatically) -->
  <script src="/socket.io/socket.io.js"></script>

  <!-- PeerJS from CDN -->
  <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>

  <!-- Framer Motion UMD -->
  <script src="https://cdn.jsdelivr.net/npm/framer-motion@11/dist/framer-motion.js"></script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080b12;
      --surface: rgba(255,255,255,0.05);
      --surface2: rgba(255,255,255,0.08);
      --border: rgba(255,255,255,0.08);
      --accent: #7c6dff;
      --accent2: #00e5c0;
      --danger: #ff4d6d;
      --text: #f0f2ff;
      --muted: #8892aa;
    }

    html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow: hidden; }

    /* Orbs */
    .orb { position: fixed; border-radius: 50%; filter: blur(130px); opacity: 0.12; pointer-events: none; z-index: 0; }
    .orb-1 { width: 700px; height: 700px; background: var(--accent); top: -250px; left: -200px; animation: drift 20s ease-in-out infinite alternate; }
    .orb-2 { width: 500px; height: 500px; background: var(--accent2); bottom: -150px; right: -100px; animation: drift 25s ease-in-out infinite alternate-reverse; }
    @keyframes drift { from { transform: translate(0,0); } to { transform: translate(60px, 40px); } }

    /* ── App shell ── */
    #app {
      position: relative;
      z-index: 1;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: rgba(8,11,18,0.6);
      backdrop-filter: blur(20px);
      flex-shrink: 0;
    }

    .logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--text), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .room-id-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 0.35rem 0.9rem;
      font-size: 0.78rem;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .room-id-badge:hover { border-color: var(--accent); color: var(--text); }
    .room-id-badge .dot {
      width: 6px; height: 6px;
      background: var(--accent2);
      border-radius: 50%;
      animation: pulse-dot 2s ease infinite;
    }
    @keyframes pulse-dot {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }

    .header-actions { display: flex; gap: 0.5rem; }

    /* ── Invite button ── */
    .btn-invite {
      display: inline-flex; align-items: center; gap: 0.45rem;
      padding: 0.5rem 1.1rem;
      background: linear-gradient(135deg, var(--accent), #5a4ed4);
      color: #fff;
      border: none; border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem; font-weight: 500;
      cursor: pointer;
      box-shadow: 0 3px 18px rgba(124,109,255,0.35);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn-invite:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(124,109,255,0.5); }
    .btn-invite:active { transform: scale(0.97); }

    /* ── Video grid ── */
    #video-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      padding: 14px;
      overflow-y: auto;
      align-content: start;
    }

    /* Each video tile */
    .video-tile {
      position: relative;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 16/9;

      /* Entry animation */
      animation: tileIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }

    @keyframes tileIn {
      from { opacity: 0; transform: scale(0.92) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .video-tile video {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 16px;
    }

    /* Muted / selfie indicator */
    .tile-label {
      position: absolute;
      bottom: 10px; left: 12px;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(6px);
      padding: 0.25rem 0.65rem;
      border-radius: 100px;
      font-size: 0.75rem;
      color: #fff;
      letter-spacing: 0.02em;
    }

    /* Camera-off placeholder */
    .cam-off-placeholder {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 0.5rem;
      color: var(--muted);
      font-size: 0.85rem;
    }
    .cam-off-placeholder .avatar {
      width: 64px; height: 64px;
      background: var(--surface2);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem;
    }

    /* ── Controls bar ── */
    #controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border);
      background: rgba(8,11,18,0.7);
      backdrop-filter: blur(20px);
      flex-shrink: 0;
    }

    .ctrl-btn {
      width: 52px; height: 52px;
      border-radius: 50%;
      border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
      transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
    }
    .ctrl-btn:active { transform: scale(0.93); }

    .ctrl-btn.active {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
    }
    .ctrl-btn.active:hover {
      background: rgba(255,255,255,0.12);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
    }

    .ctrl-btn.muted {
      background: rgba(255,77,109,0.15);
      border: 1px solid rgba(255,77,109,0.3);
      color: var(--danger);
    }
    .ctrl-btn.muted:hover {
      background: rgba(255,77,109,0.25);
    }

    /* Leave button — larger, danger */
    .ctrl-btn.leave {
      background: var(--danger);
      color: #fff;
      width: 56px; height: 56px;
      box-shadow: 0 4px 20px rgba(255,77,109,0.4);
    }
    .ctrl-btn.leave:hover {
      box-shadow: 0 6px 28px rgba(255,77,109,0.6);
      transform: scale(1.05);
    }

    /* ── Participant count chip ── */
    #participant-count {
      font-size: 0.8rem;
      color: var(--muted);
      padding: 0 1rem;
    }

    /* ── Toast ── */
    #toast {
      position: fixed;
      bottom: 6rem;
      left: 50%;
      transform: translateX(-50%) translateY(60px);
      background: rgba(0,229,192,0.12);
      border: 1px solid rgba(0,229,192,0.25);
      color: var(--accent2);
      padding: 0.6rem 1.3rem;
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 500;
      backdrop-filter: blur(12px);
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s;
      opacity: 0;
      z-index: 999;
      white-space: nowrap;
    }
    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

    /* ── Ripple on tile entry ── */
    @keyframes ripple {
      from { box-shadow: 0 0 0 0 rgba(124,109,255,0.4); }
      to   { box-shadow: 0 0 0 18px rgba(124,109,255,0); }
    }
    .video-tile.new { animation: tileIn 0.45s cubic-bezier(0.22,1,0.36,1) both, ripple 0.8s ease-out 0.2s 1; }

    /* ── Empty state ── */
    #empty-state {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      color: var(--muted);
      pointer-events: none;
    }
    #empty-state .icon { font-size: 3rem; opacity: 0.3; }
    #empty-state p { font-size: 0.9rem; opacity: 0.5; }
  </style>
</head>
<body>

  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <div id="app">

    <!-- Header -->
    <header>
      <div class="logo">Nexus</div>

      <div class="room-id-badge" id="roomBadge" title="Click to copy room link">
        <span class="dot"></span>
        <span id="roomIdLabel">Loading…</span>
      </div>

      <div class="header-actions">
        <button class="btn-invite" id="inviteBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Invite
        </button>
      </div>
    </header>

    <!-- Video grid -->
    <div id="video-grid" style="position:relative;">
      <div id="empty-state">
        <div class="icon">📡</div>
        <p>Waiting for others to join…</p>
      </div>
    </div>

    <!-- Controls -->
    <div id="controls">
      <button class="ctrl-btn active" id="muteBtn" title="Mute / Unmute">🎤</button>
      <button class="ctrl-btn active" id="camBtn"  title="Camera on / off">📷</button>
      <span id="participant-count">1 participant</span>
      <button class="ctrl-btn leave" id="leaveBtn" title="Leave meeting">📵</button>
    </div>

  </div>

  <div id="toast"></div>

  <script>
  (async () => {
    // ── Room ID from URL ────────────────────────────────────
    const roomId = window.location.pathname.replace(/^\//, '');
    if (!roomId) { window.location.href = '/'; return; }

    document.getElementById('roomIdLabel').textContent = roomId.slice(0,8) + '…';
    document.title = `Nexus — ${roomId.slice(0,8)}`;

    // ── State ───────────────────────────────────────────────
    let isMuted = false;
    let isCamOff = false;
    let myStream = null;
    const peers = {}; // peerId → MediaConnection
    let participantCount = 1;

    // ── Media ───────────────────────────────────────────────
    try {
      myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (err) {
      showToast('⚠ Camera/mic permission denied');
      myStream = new MediaStream(); // continue without media
    }

    addVideoTile(myStream, 'You', true);
    updateCount();

    // ── PeerJS ──────────────────────────────────────────────
    const peer = new Peer({
      host: window.location.hostname,
      port: window.location.port || (location.protocol === 'https:' ? 443 : 80),
      path: '/peerjs',
    });

    peer.on('open', (peerId) => {
      console.log('[peer] My ID:', peerId);

      // Tell server: I joined room X with peerID
      const socket = io();

      socket.emit('join-room', roomId, peerId);

      // ── Someone else joined → call them ──────────────────
      socket.on('user-connected', (remotePeerId) => {
        console.log('[socket] user-connected:', remotePeerId);
        showToast('👤 Someone joined the room');
        callPeer(remotePeerId);
      });

      // ── Someone left ─────────────────────────────────────
      socket.on('user-disconnected', (remotePeerId) => {
        console.log('[socket] user-disconnected:', remotePeerId);
        if (peers[remotePeerId]) {
          peers[remotePeerId].close();
          delete peers[remotePeerId];
        }
        removeTile(remotePeerId);
        participantCount = Math.max(1, participantCount - 1);
        updateCount();
        showToast('👤 Participant left');
      });
    });

    // ── Answer incoming calls ─────────────────────────────
    peer.on('call', (call) => {
      call.answer(myStream);
      call.on('stream', (remoteStream) => {
        if (!document.getElementById(`tile-${call.peer}`)) {
          addVideoTile(remoteStream, 'Peer', false, call.peer);
          peers[call.peer] = call;
          participantCount++;
          updateCount();
        }
      });
      call.on('close', () => { removeTile(call.peer); });
    });

    peer.on('error', (err) => {
      console.error('[peer error]', err);
      showToast('⚠ Connection error — check console');
    });

    // ── Call a remote peer ────────────────────────────────
    function callPeer(remotePeerId) {
      const call = peer.call(remotePeerId, myStream);
      peers[remotePeerId] = call;
      call.on('stream', (remoteStream) => {
        if (!document.getElementById(`tile-${remotePeerId}`)) {
          addVideoTile(remoteStream, 'Peer', false, remotePeerId);
          participantCount++;
          updateCount();
        }
      });
      call.on('close', () => { removeTile(remotePeerId); });
    }

    // ── Add video tile ────────────────────────────────────
    function addVideoTile(stream, label, isLocal, id) {
      const grid = document.getElementById('video-grid');
      const emptyState = document.getElementById('empty-state');
      if (emptyState) emptyState.remove();

      const tileId = isLocal ? 'tile-local' : `tile-${id}`;
      if (document.getElementById(tileId)) return;

      const tile = document.createElement('div');
      tile.className = 'video-tile new';
      tile.id = tileId;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      if (isLocal) { video.muted = true; video.style.transform = 'scaleX(-1)'; }

      const lbl = document.createElement('div');
      lbl.className = 'tile-label';
      lbl.textContent = isLocal ? '🟢 You' : '👤 ' + label;

      tile.appendChild(video);
      tile.appendChild(lbl);
      grid.appendChild(tile);

      // Remove "new" class after animation
      tile.addEventListener('animationend', () => tile.classList.remove('new'), { once: true });
    }

    // ── Remove tile ───────────────────────────────────────
    function removeTile(id) {
      const tile = document.getElementById(`tile-${id}`);
      if (!tile) return;
      tile.style.transition = 'opacity 0.3s, transform 0.3s';
      tile.style.opacity = '0';
      tile.style.transform = 'scale(0.9)';
      setTimeout(() => tile.remove(), 320);
    }

    // ── Controls ──────────────────────────────────────────
    document.getElementById('muteBtn').addEventListener('click', () => {
      isMuted = !isMuted;
      myStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      const btn = document.getElementById('muteBtn');
      btn.textContent = isMuted ? '🔇' : '🎤';
      btn.className = `ctrl-btn ${isMuted ? 'muted' : 'active'}`;
      showToast(isMuted ? '🔇 Muted' : '🎤 Unmuted');
    });

    document.getElementById('camBtn').addEventListener('click', () => {
      isCamOff = !isCamOff;
      myStream.getVideoTracks().forEach(t => t.enabled = !isCamOff);
      const btn = document.getElementById('camBtn');
      btn.textContent = isCamOff ? '🚫' : '📷';
      btn.className = `ctrl-btn ${isCamOff ? 'muted' : 'active'}`;
      showToast(isCamOff ? '📷 Camera off' : '📷 Camera on');
    });

    document.getElementById('leaveBtn').addEventListener('click', () => {
      peer.destroy();
      window.location.href = '/';
    });

    // ── Invite / copy link ────────────────────────────────
    const inviteUrl = `${window.location.origin}/${roomId}`;

    document.getElementById('inviteBtn').addEventListener('click', copyInvite);
    document.getElementById('roomBadge').addEventListener('click', copyInvite);

    async function copyInvite() {
      try {
        await navigator.clipboard.writeText(inviteUrl);
        showToast('✅ Invite link copied!');
      } catch {
        prompt('Copy this invite link:', inviteUrl);
      }
    }

    // ── Participant count ─────────────────────────────────
    function updateCount() {
      const el = document.getElementById('participant-count');
      el.textContent = `${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
    }

    // ── Toast ─────────────────────────────────────────────
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 2800);
    }

  })();
  </script>

</body>
</html>
```

---

## What's in the Frontend

| Feature | How it works |
|---------|-------------|
| **Landing page** | `crypto.randomUUID()` creates a room ID → redirects to `/<roomId>` |
| **Join via link** | Pastes a full URL or bare UUID; strips origin prefix automatically |
| **Video grid** | Auto-fit CSS grid; each tile animates in with a scale + fade |
| **Self-view** | Mirrored via `scaleX(-1)`, muted locally so no echo |
| **Mute / Cam off** | Toggles `MediaStreamTrack.enabled` — stream stays open to peers |
| **Invite button** | Copies `window.location.origin/roomId` to clipboard |
| **Room ID badge** | Shows truncated ID; click also copies invite link |
| **Leave button** | Calls `peer.destroy()` then redirects home |
| **Toast notifications** | Spring-animated chip for all state changes |
| **Framer Motion** | Loaded via CDN; available as `window.Motion` for any extra animations |

---

## Connecting PeerJS: The Critical Config

```js
const peer = new Peer({
  host: window.location.hostname,   // 'localhost' in dev
  port: window.location.port || 80,  // 3000 in dev
  path: '/peerjs',                   // must match server.js mount
});
```

This tells PeerJS to register with **your** Express server rather than the free cloud broker, so you control signaling.

---

## Complete Data Flow (Visual)

```
index.html                server.js                 room.html (Peer B)
──────────                ─────────                 ──────────────────
click "New Meeting"
  → generate UUID
  → redirect /UUID

                      GET /UUID
                      ← room.html

room.html loads
Peer A connects to PeerJS
peer.on('open', pidA)
  socket.emit('join-room', UUID, pidA)
                      io.on('join-room')
                        socket.join(UUID)
                                          Peer B arrives
                                          socket.emit('join-room', UUID, pidB)
                      ← user-connected(pidB) to Peer A
Peer A calls Peer B
  peer.call(pidB, streamA)
                      [PeerJS ICE relay]
                                          call.answer(streamB)
                                          call.on('stream') → addVideoTile
addVideoTile(streamB)
  ◄══ live video/audio stream ══►
```

---

## Running Everything

```bash
node server.js
# Open http://localhost:3000 in two different browser windows
# Click "New Meeting" in one, paste the URL into the other
```
