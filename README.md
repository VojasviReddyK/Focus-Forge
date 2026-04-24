# Focus Forge

A productivity app for tracking DSA, System Design, Job Applications, and more.

## Setup

1. Install dependencies:
   - Server: `cd server && npm install`
   - Client: `cd client && npm install`

2. Set up environment variables:
   - Copy `.env` files and update as needed.
   - For server: `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CORS_ORIGINS` (e.g. `http://localhost:5173,http://localhost:5174`).
   - For client: `VITE_API_URL`

3. Start MongoDB (if using local).

4. Run:
   - Server: `cd server && npm run dev`
   - Client: `cd client && npm run dev`

## Features

- Dashboard with progress tracking
- DSA Tracker
- System Design Tracker
- Job Tracker
- Calendar Notes
- Analytics
- Gamification with points, levels, streaks

## Tech Stack

- Backend: Node.js, Express, MongoDB, JWT
- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand
