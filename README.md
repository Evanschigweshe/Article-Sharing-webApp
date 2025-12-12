# Article Share App

This is a full-stack web application that allows users to share article URLs on a common message board. Users can register, log in, post articles, view all posts, and delete their own posts. An admin account is automatically created and can delete any post.

## Features

* **User functionality:**

  * Register and log in
  * Post article links with optional titles
  * View all article links
  * Delete their own posts
* **Admin functionality:**

  * Admin account (`username: admin`, `password: admin`) created on first run
  * Delete posts from any user
* **Security:**

  * Passwords hashed with bcrypt
  * JWT authentication stored in HTTP-only cookies
  * Input validation for URLs
  * Prepared statements for database queries
  * Rate limiting and security headers via Helmet

## Tech Stack

* **Backend:** Node.js, Express, SQLite (via better-sqlite3), bcrypt, JWT
* **Frontend:** React, Vite

## Project Structure

```
article-share-app/
├─ server/                 # Node.js backend
│  ├─ index.js
│  ├─ db.js
│  ├─ schema.sql
│  ├─ package.json
│  └─ README.md
├─ web/                    # React frontend
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ api.js
│  │  └─ components/
│  │     ├─ Login.jsx
│  │     ├─ Register.jsx
│  │     ├─ Board.jsx
│  │     ├─ NewPost.jsx
│  │     └─ PostItem.jsx
│  ├─ index.html
│  └─ package.json
└─ README.md
```

## Setup Instructions

### 1. Backend

1. Navigate to the server folder:

   ```bash
   cd server
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the server (development mode with nodemon):

   ```bash
   npm run dev
   ```

   or without nodemon:

   ```bash
   node index.js
   ```
4. The server runs by default on `http://localhost:4000`.

### 2. Frontend

1. Navigate to the web folder:

   ```bash
   cd web
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the frontend server:

   ```bash
   npm run dev
   ```
4. Open the app in your browser: `http://localhost:5173`

### 3. Usage

1. Register a new user or log in as admin (`admin` / `admin`).
2. Post articles using URLs with optional titles.
3. View all posts on the message board.
4. Delete posts (admin can delete any post).

## Security Notes

* All passwords are hashed with bcrypt before storage.
* JWT tokens are stored in HTTP-only cookies to prevent XSS attacks.
* Server-side validation ensures URLs are valid and prevents SQL injection via prepared statements.
* Helmet middleware and rate limiting are implemented to enhance security.
---
