const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const PORT = process.env.PORT || 4000;

const app = express();

// Security middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

// CORS for the frontend running on :5173 (Vite default). Allow credentials for cookies.
app.use(cors({ origin: true, credentials: true }));

// --- helpers ---
function createUser(id, username, passwordHash, role = 'user') {
  const insert = db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)');
  insert.run(id, username, passwordHash, role);
}

function findUserByUsername(username) {
  return db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').get(username);
}

function findUserById(id) {
  return db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(id);
}

function createAdminIfMissing() {
  const user = findUserByUsername(ADMIN_USERNAME);
  if (!user) {
    const saltRounds = 12;
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, saltRounds);
    createUser(uuidv4(), ADMIN_USERNAME, hash, 'admin');
    console.log('Admin user created with username="admin" and password="admin" (change this in production)');
  } else {
    console.log('Admin user already exists');
  }
}

createAdminIfMissing();

// --- auth middleware ---
function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies['token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- routes ---
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'invalid input' });
  if (username.length < 3 || password.length < 6) return res.status(400).json({ error: 'username or password too short' });

  try {
    const existing = findUserByUsername(username);
    if (existing) return res.status(409).json({ error: 'username taken' });
    const hash = await bcrypt.hash(password, 12);
    const id = uuidv4();
    createUser(id, username, hash, 'user');
    return res.status(201).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = findUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  // Set token in httpOnly cookie
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, username: user.username, role: user.role });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// posts
app.get('/api/posts', (req, res) => {
  const rows = db.prepare(`SELECT p.id, p.url, p.title, p.user_id, p.created_at, u.username
    FROM posts p JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC`).all();
  res.json(rows.map(r => ({
    id: r.id,
    url: r.url,
    title: r.title,
    user_id: r.user_id,
    username: r.username,
    created_at: r.created_at
  })));
});

app.post('/api/posts', authMiddleware, (req, res) => {
  const { url, title } = req.body || {};
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url required' });
  // basic validation
  try {
    // ensure it's a valid URL
    const parsed = new URL(url);
    // allow only http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid protocol');
  } catch (e) {
    return res.status(400).json({ error: 'invalid url' });
  }

  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO posts (id, url, title, user_id, created_at) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, url, title || null, req.user.id, Date.now());
  res.status(201).json({ success: true, id });
});

app.delete('/api/posts/:id', authMiddleware, (req, res) => {
  const postId = req.params.id;
  const post = db.prepare('SELECT id, user_id FROM posts WHERE id = ?').get(postId);
  if (!post) return res.status(404).json({ error: 'not found' });
  // admin or owner
  if (req.user.role !== 'admin' && req.user.id !== post.user_id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
  res.json({ success: true });
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
